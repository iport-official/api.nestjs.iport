import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import PostEntity from 'src/typeorm/entities/post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity])],
    providers: [PostService],
    exports: [PostService],
    controllers: [PostController]
})
export class PostModule { }
