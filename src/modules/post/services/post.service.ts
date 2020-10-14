import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { AccountType } from 'src/models/enums/account.types'

import { PostEntity } from 'src/typeorm/entities/post.entity'

import { CreatePostPayload } from '../models/create-post.payload'
import { UpdatePostPayload } from '../models/update-post.payload'
import { ArrayProxy } from 'src/common/array-proxy'

import { UserService } from 'src/modules/user/services/user.service'

import { RequestUserProperties } from 'src/common/jwt-validation-properties'

const contentInPage = 5

@Injectable()
export class PostService extends TypeOrmCrudService<PostEntity> {
    public constructor(
        @InjectRepository(PostEntity)
        private readonly repository: Repository<PostEntity>,
        private readonly userService: UserService
    ) {
        super(repository)
    }

    /**
     * Method that adds a new post in the database
     * @param createPostPayload stores the post data that will be used to
     *  create a new post in the database
     */
    public async createPost(
        requestUser: RequestUserProperties,
        createPostPayload: CreatePostPayload
    ): Promise<PostEntity> {
        const user = await this.userService.getMe(requestUser)
        if (!user) throw new NotFoundException('User not found')
        try {
            return await this.repository.save({
                ...createPostPayload,
                user
            })
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    /**
     * Method that can return an unique post
     * @param id indicates which post the users wants to get
     */
    public async getUniquePost(id: string): Promise<PostEntity> {
        const post = await this.repository
            .createQueryBuilder('posts')
            .where({ id })
            .leftJoinAndSelect('posts.user', 'users')
            .innerJoinAndSelect('users.companyUser', 'companyusers.user')
            .leftJoinAndSelect('users.telephones', 'telephones.user')
            .leftJoinAndSelect('users.emails', 'emails.user')
            .getOne()
        if (!post) throw new NotFoundException('Post not found')
        return post
    }

    /**
     * Method that returns the most recommended posts in the app
     * @param page indicates which page the user want to laod
     */
    public async getHighlights(page: number): Promise<ArrayProxy<PostEntity>> {
        try {
            const queryBuilder = this.repository
                .createQueryBuilder('posts')
                .orderBy('posts.recommendations', 'DESC')

            const length = await queryBuilder.getCount()

            const array = await queryBuilder
                .offset(page * contentInPage)
                .leftJoinAndSelect('posts.user', 'users')
                .innerJoinAndSelect('users.companyUser', 'companyusers.user')
                .leftJoinAndSelect('users.telephones', 'telephones.user')
                .leftJoinAndSelect('users.emails', 'emails.user')
                .limit(page * contentInPage + contentInPage)
                .getMany()

            return {
                length,
                array
            }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    /**
     * Method that can get the recomendations for each user, based on the category
     * @param category inidicates which category the user want
     * @param page indicates which page the user want to get
     */
    public async getByCategory(
        category: string,
        page: number
    ): Promise<ArrayProxy<PostEntity>> {
        try {
            const queryBuilder = this.repository
                .createQueryBuilder('posts')
                .where({ category })
                .orderBy('posts.recommendations', 'DESC')

            const length = await queryBuilder.getCount()

            const array = await queryBuilder
                .offset(page * contentInPage)
                .leftJoinAndSelect('posts.user', 'users')
                .innerJoinAndSelect('users.companyUser', 'companyusers.user')
                .leftJoinAndSelect('users.telephones', 'telephones.user')
                .leftJoinAndSelect('users.emails', 'emails.user')
                .limit(page * contentInPage + contentInPage)
                .getMany()

            return {
                length,
                array
            }
        } catch (error) {
            throw new NotFoundException(error)
        }
    }

    /**
     * Method that can get the main post
     */
    public async getMainPost(): Promise<PostEntity> {
        const main = await this.repository
            .createQueryBuilder('posts')
            .addSelect(
                'MAX(posts.recommendations * 0.7 * posts.likes * 0.3)',
                'MAX'
            )
            .leftJoinAndSelect('posts.user', 'users')
            .innerJoinAndSelect('users.companyUser', 'companyusers.user')
            .leftJoinAndSelect('users.telephones', 'telephones.user')
            .leftJoinAndSelect('users.emails', 'emails.user')
            .getOne()
        if (!main) throw new NotFoundException('Post not found')
        return main
    }

    /**
     * Method that can return all the posts of a specific user
     * @param userId stores the user id
     */
    public async getPostsByUserId(
        userId: string
    ): Promise<ArrayProxy<PostEntity>> {
        try {
            const query = this.repository
                .createQueryBuilder('posts')
                .where({ user: userId })

            const length = await query.getCount()

            const array = await query
                .innerJoinAndSelect('posts.user', 'users')
                .innerJoinAndSelect('users.companyUser', 'companyusers.user')
                .leftJoinAndSelect('users.telephones', 'telephones.user')
                .leftJoinAndSelect('users.emails', 'emails.user')
                .getMany()

            return {
                length,
                array
            }
        } catch (error) {
            throw new NotFoundException(error)
        }
    }

    /**
     * Method that can update some post
     * @param id stores the post id
     * @param updatePostPayload stores the new post data
     */
    public async updatePostById(
        id: string,
        updatePostPayload: UpdatePostPayload
    ): Promise<PostEntity> {
        const { userId } = await this.repository
            .createQueryBuilder('posts')
            .select('userId')
            .where({ id })
            .getRawOne<{ userId: string }>()
        const user = await this.userService.getUserById(
            userId,
            AccountType.COMPANY
        )
        if (!user) throw new NotFoundException('User not found')
        try {
            return await this.repository.save({
                id,
                user,
                ...updatePostPayload
            })
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    /**
     * Method that can delete a specific post
     * @param id stores the postid
     */
    public async deletePostById(
        requestUser: RequestUserProperties,
        id: string
    ): Promise<void> {
        if (!PostService.hasPermissionToUpdate(requestUser, id))
            throw new ForbiddenException(
                "You don't have permission to update the informations of this post"
            )
        try {
            await this.repository.delete({ id })
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    //#region Utils

    private static hasPermissionToUpdate(
        requestUser: RequestUserProperties,
        id: string
    ): boolean {
        return (
            requestUser.id === id ||
            requestUser.accountType === AccountType.ADMIN
        )
    }

    //#endregion
}
