import {
    Controller,
    Body,
    Post,
    UseGuards,
    Get,
    Query,
    UseInterceptors,
    UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'

import { PostService } from '../services/post.service';
import { CreatePostPayload } from '../models/create-post.payload';
import { JwtAuthGuard } from '../../../guards/jwt/jwt-auth.guard';
import { PostProxy } from '../models/post.proxy';

@Controller('posts')
export class PostController {
    constructor(public postService: PostService) { }

    /**
     * Method that can create posts
     * @param createPostPayload stores the post data before creating it
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image', {
        limits: {
            fileSize: 2 * 1024 * 1024
        }
    }))
    async create(
        @UploadedFile() file,
        @Body() createPostPayload: CreatePostPayload
    ): Promise<PostProxy> {
        createPostPayload.image = file.buffer.toString('base64')
        return await this.postService.create(createPostPayload)
    }

    /**
     * Method that returns the most recommended posts in the app
     * @param page indicates which page the user want to laod
     */
    @UseGuards(JwtAuthGuard)
    @Get('/highlights')
    async getHighlights(@Query('page') page: number): Promise<PostProxy[]> {
        return await this.postService.getHighlights(page)
    }
}
