import { Repository } from 'typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PostEntity } from 'src/typeorm/entities/post.entity';
import { PostProxy } from '../models/post.proxy';
import { CreatePostPayload } from '../models/create-post.payload';

@Injectable()
export class PostService extends TypeOrmCrudService<PostEntity> {
    constructor(
        @InjectRepository(PostEntity)
        private readonly repository: Repository<PostEntity>
    ) { super(repository) }

    /**
     * Method that adds a new post in the database
     * @param postData stores the post data that will be used to
     *  create a new post in the database
     */
    async create(postData: CreatePostPayload): Promise<PostProxy> {
        try {
            return await this.repository.save(postData)
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
                .createQueryBuilder("users")
                .orderBy('users.recomendation', 'DESC')
                .getMany()

            return posts.map(entity => new PostProxy(entity))
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
