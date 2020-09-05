import { Repository } from 'typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PostEntity } from 'src/typeorm/entities/post.entity';
import { CreatePostDto } from './dto/create-post-dto';

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
    async createPost(postData: CreatePostDto): Promise<CreatePostDto> {
        try {
            const response = await this.repository.save(postData)
            return response
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    /**
     * Method that return all the current posts
     */
    async getAllPosts() {
        try {
            return await this.repository.find()
        } catch (error) {
            console.log(error)
        }
    }
}
