import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Post } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { PostEntity } from 'src/typeorm/entities/post.entity';
import { CreatePostPayload } from '../models/create-post.payload';
import { BaseArrayProxy } from 'src/common/base-array-proxy';
import { PostProxy } from '../models/post.proxy';

import { UserService } from 'src/modules/user/services/user.service';

const contentInPage = 5

@Injectable()
export class PostService extends TypeOrmCrudService<PostEntity> {

    constructor(
        @InjectRepository(PostEntity)
        private readonly repository: Repository<PostEntity>,
        private readonly userService: UserService
    ) { super(repository) }

    /**
     * Method that adds a new post in the database
     * @param createPostPayload stores the post data that will be used to
     *  create a new post in the database
     */
    async create(createPostPayload: CreatePostPayload): Promise<PostProxy> {
        try {
            const user = await this.userService.findOne({ where: { id: createPostPayload.userId } })
            createPostPayload.userId = undefined
            const post = await this.repository.save({
                ...createPostPayload,
                user
            })
            return new PostProxy(post)
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    /**
     * Method that can return an unique post
     * @param id indicates which post the users wants to get
     */
    async getUniquePost(id: string): Promise<PostProxy> {
        try {
            const post = await this.repository
                .createQueryBuilder('posts')
                .where({ id })
                .leftJoinAndSelect('posts.user', 'user')
                .getOne()
            return new PostProxy(post)
        } catch (error) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
    }

    /**
     * Method that returns the most recommended posts in the app
     * @param page indicates which page the user want to laod
     */
    async getHighlights(page: number): Promise<BaseArrayProxy<PostProxy>> {
        try {
            const queryBuilder = this.repository
                .createQueryBuilder('posts')
                .orderBy('posts.recomendations', 'DESC')

            const length = await queryBuilder
                .getCount()

            const array = await queryBuilder
                .offset(page * contentInPage)
                .leftJoinAndSelect('posts.user', 'user')
                .limit(page * contentInPage + contentInPage)
                .getMany()

            return {
                length,
                array: array.map((entity: PostEntity) => new PostProxy(entity))
            }
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    /**
     * Method that can get the recomendations for each user, based on the category
     * @param category inidicates which category the user want
     * @param page indicates which page the user want to get
     */
    async getByCategory(category: string, page: number): Promise<BaseArrayProxy<PostProxy>> {
        try {
            const queryBuilder = this.repository
                .createQueryBuilder('posts')
                .where({ category })
                .orderBy('posts.recomendations', 'DESC')

            const length = await queryBuilder
                .getCount()

            const array = await queryBuilder
                .offset(page * contentInPage)
                .leftJoinAndSelect('posts.user', 'user')
                .limit(page * contentInPage + contentInPage)
                .getMany()

            return {
                length,
                array: array.map((entity: PostEntity) => new PostProxy(entity))
            }
        } catch (error) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
    }

    /**
     * Method that can get the main post
     */
    async getMainPost(): Promise<PostProxy> {
        try {
            const post = await this.repository
                .createQueryBuilder('posts')
                .select()
                .addSelect('MAX(posts.recomendations * 0.7 * posts.likes * 0.3)', 'MAX')
                .leftJoinAndSelect('posts.user', 'user')
                .getOne()

            return new PostProxy(post)
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
