import { Repository } from 'typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PostEntity } from 'src/typeorm/entities/post.entity';
import { PostProxy } from '../models/post.proxy';
import { CreatePostPayload } from '../models/create-post.payload';
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
            return await this.repository.save({
                ...createPostPayload,
                user
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    /**
     * Method that can return an unique post
     * @param id indicates which post the users wants to get
     */
    async getUniquePost(id: string): Promise<PostProxy> {
        try {
            return await this.repository
                .createQueryBuilder('posts')
                .where({ id })
                .leftJoinAndSelect('posts.user', 'user')
                .getOne()
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    /**
     * Method that returns the most recommended posts in the app
     * @param page indicates which page the user want to laod
     */
    async getHighlights(page: number): Promise<PostProxy[]> {
        try {
            const posts = await this.repository
                .createQueryBuilder('posts')
                .orderBy('posts.recomendation', 'DESC')
                .offset(page * contentInPage)
                .leftJoinAndSelect('posts.user', 'user')
                .limit(page * contentInPage + contentInPage)
                .getMany()
            return posts.map(entity => new PostProxy(entity))
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    /**
     * Method that can get the recomendations for each user, based on the category
     * @param category inidicates which category the user want
     * @param page indicates which page the user want to get
     */
    async getRecomendations(category: string, page: number): Promise<PostProxy[]> {
        try {
            const posts = await this.repository
                .createQueryBuilder('posts')
                .where({ category })
                .orderBy('posts.recomendation', 'DESC')
                .offset(page * contentInPage)
                .leftJoinAndSelect('posts.user', 'user')
                .limit(page * contentInPage + contentInPage)
                .getMany()
            return posts.map(entity => new PostProxy(entity))
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
