import {
    Controller,
    Body,
    Post,
    UseGuards,
    Get,
    Query,
    UseInterceptors,
    UploadedFile,
    Param
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
        @UploadedFile() file: any,
        @Body() createPostPayload: CreatePostPayload
    ): Promise<PostProxy> {
        createPostPayload.image = file.buffer.toString('base64')
        return await this.postService.create(createPostPayload)
    }

    @Get()
    async getUniquePost(@Query('id') id: string) {
        return await this.postService.getUniquePost(id)
    }

    /**
     * Method that returns the most recommended posts in the appk
     * @param page indicates which page the user want to laod
     */
    @Get('highlights')
    async getHighlights(@Query('page') page: number): Promise<PostProxy[]> {
        return await this.postService.getHighlights(page)
    }

    @Get('recomendations')
    async getRecomendations(@Query('category') category: string, @Query('page') page: number): Promise<PostProxy[]> {
        return await this.postService.getRecomendations(category, page)
    }
}
