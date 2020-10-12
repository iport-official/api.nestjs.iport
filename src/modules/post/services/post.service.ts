import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { PostEntity } from 'src/typeorm/entities/post.entity'

import { CreatePostPayload } from '../models/create-post.payload'
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
        try {
            const user = await this.userService.getMe(requestUser)
            const post = await this.repository.save({
                ...createPostPayload,
                user
            })
            return post
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    /**
     * Method that can return an unique post
     * @param id indicates which post the users wants to get
     */
    public async getUniquePost(id: string): Promise<PostEntity> {
        try {
            const post = await this.repository
                .createQueryBuilder('posts')
                .where({ id })
                .leftJoinAndSelect('posts.user', 'users')
                .innerJoinAndSelect('users.companyUser', 'companyusers.user')
                .innerJoinAndSelect('users.telephones', 'telephones.user')
                .innerJoinAndSelect('users.emails', 'emails.user')
                .getOne()
            return post
        } catch (error) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
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
                .innerJoinAndSelect('users.telephones', 'telephones.user')
                .innerJoinAndSelect('users.emails', 'emails.user')
                .limit(page * contentInPage + contentInPage)
                .getMany()

            return {
                length,
                array
            }
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
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
                .innerJoinAndSelect('users.telephones', 'telephones.user')
                .innerJoinAndSelect('users.emails', 'emails.user')
                .limit(page * contentInPage + contentInPage)
                .getMany()

            return {
                length,
                array
            }
        } catch (error) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
    }

    /**
     * Method that can get the main post
     */
    public async getMainPost(): Promise<PostEntity> {
        try {
            return await this.repository
                .createQueryBuilder('posts')
                .addSelect(
                    'MAX(posts.recommendations * 0.7 * posts.likes * 0.3)',
                    'MAX'
                )
                .leftJoinAndSelect('posts.user', 'users')
                .innerJoinAndSelect('users.companyUser', 'companyusers.user')
                .innerJoinAndSelect('users.telephones', 'telephones.user')
                .innerJoinAndSelect('users.emails', 'emails.user')
                .getOne()
        } catch (error) {
            console.log(error)
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
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
                .innerJoinAndSelect('users.telephones', 'telephones.user')
                .innerJoinAndSelect('users.emails', 'emails.user')
                .getMany()

            return {
                length,
                array
            }
        } catch (error) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
    }
}
