import {
    Controller,
    Body,
    Post,
    UseGuards,
    Get,
    Query,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'

import { PostService } from '../services/post.service';

import { BaseArrayProxy } from 'src/common/base-array-proxy';

import { CreatePostPayload } from '../models/create-post.payload';
import { PostProxy } from '../models/post.proxy';

import { JwtAuthGuard } from '../../../guards/jwt/jwt-auth.guard';

@Controller('posts')
export class PostController {

    constructor(
        private readonly postService: PostService
    ) { }

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

    /**
     * Method that can return an unique post
     * @param id indicates which post the users wants to get
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    async getUniquePost(@Query('id') id: string): Promise<PostProxy> {
        return await this.postService.getUniquePost(id)
    }

    /**
     * Method that returns the most recommended posts in the appk
     * @param page indicates which page the user want to laod
     */
    @UseGuards(JwtAuthGuard)
    @Get('highlights')
    async getHighlights(@Query('page') page: number): Promise<BaseArrayProxy<PostProxy>> {
        return await this.postService.getHighlights(page)
    }

    /**
     * Method that can get the recomendations for each user, based on the category
     * @param category inidicates which category the user want
     * @param page indicates which page the user want to get
     */
    @UseGuards(JwtAuthGuard)
    @Get('categories')
    async getByCategory(
        @Query('category') category: string,
        @Query('page') page: number
    ): Promise<BaseArrayProxy<PostProxy>> {
        return await this.postService.getByCategory(category, page)
    }

}
