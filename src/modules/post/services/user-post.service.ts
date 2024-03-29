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

@Injectable()
export class UserPostService extends TypeOrmCrudService<PostEntity> {
    public constructor(
        @InjectRepository(PostEntity)
        private readonly repository: Repository<PostEntity>,
        private readonly userService: UserService
    ) {
        super(repository)
    }

    /**
     * Method that adds a new post in the database
     * @param userId stores the user id
     * @param requestUser stores the user basic data
     * @param createPostPayload stores the post data
     */
    public async createPost(
        userId: string,
        requestUser: RequestUserProperties,
        createPostPayload: CreatePostPayload
    ): Promise<PostEntity> {
        if (!UserPostService.hasPermissionToUpdate(userId, requestUser))
            throw new ForbiddenException(
                "You don't have permission to create posts"
            )

        const user = await this.userService.getUserById(
            userId,
            AccountType.COMPANY
        )
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

    public async getPostById(id: string): Promise<PostEntity> {
        const post = await this.repository
            .createQueryBuilder('posts')
            .where({ id })
            .innerJoinAndSelect('posts.user', 'users')
            .innerJoinAndSelect('users.companyUser', 'companyusers.user')
            .getOne()
        if (!post) throw new NotFoundException('Post not found')
        return post
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
     * @param userId stores the user id
     * @param requestUser stores the user basic data
     * @param updatePostPayload stores the new post data
     */
    public async updatePostById(
        id: string,
        userId: string,
        requestUser: RequestUserProperties,
        updatePostPayload: UpdatePostPayload
    ): Promise<PostEntity> {
        if (!UserPostService.hasPermissionToUpdate(userId, requestUser))
            throw new ForbiddenException(
                "You don't have permission to create posts"
            )
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
     * @param id stores the post id
     * @param userId stores the user id
     * @param requestUser stores the user basic data
     */
    public async deletePostById(
        id: string,
        userId: string,
        requestUser: RequestUserProperties
    ): Promise<void> {
        if (!UserPostService.hasPermissionToUpdate(userId, requestUser))
            throw new ForbiddenException(
                "You don't have permission to create posts"
            )
        const user = await this.userService.getUserById(
            userId,
            AccountType.COMPANY
        )
        if (!user) throw new NotFoundException('User not found')
        try {
            await this.repository.delete({ id })
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    //#region Utils

    /**
     * Static method that can check if the user has the permission to call some method
     * @param userId stores the user id
     * @param requestUser stores the user basic data
     */
    private static hasPermissionToUpdate(
        userId: string,
        requestUser: RequestUserProperties
    ): boolean {
        return (
            requestUser.id === userId ||
            requestUser.accountType === AccountType.ADMIN
        )
    }

    //#endregion
}
