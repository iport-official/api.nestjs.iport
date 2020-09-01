import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import PostEntity from 'src/typeorm/entities/post.entity';
import { CreatePostDto } from './dto/CreatePostDto';

@Injectable()
export class PostService extends TypeOrmCrudService<PostEntity> {
    constructor(
        @InjectRepository(PostEntity)
        private readonly repository: Repository<PostEntity>
    ) { super(repository) }

    public async createPost(post: CreatePostDto) {
        try {
            const response = await this.repository.save(post)
            return response;
        } catch (error) {
            return error
        }
    }
}
