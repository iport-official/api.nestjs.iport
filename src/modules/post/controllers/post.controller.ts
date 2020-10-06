import { Controller, Body, Post, UseGuards, Get, Query } from '@nestjs/common'

import { PostService } from '../services/post.service'

import { BaseArrayProxy } from 'src/common/base-array-proxy'

import { CreatePostPayload } from '../models/create-post.payload'
import { PostProxy } from '../models/post.proxy'

import { JwtAuthGuard } from '../../../guards/jwt/jwt-auth.guard'

@Controller('posts')
export class PostController {
    public constructor(private readonly postService: PostService) {}

    /**
     * Method that can create posts
     * @param createPostPayload stores the post data before creating it
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    public async create(
        @Body() createPostPayload: CreatePostPayload
    ): Promise<PostProxy> {
        return await this.postService.createPost(createPostPayload)
    }

    /**
     * Method that can return an unique post
     * @param id indicates which post the users wants to get
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    public async getUniquePost(@Query('id') id: string): Promise<PostProxy> {
        return await this.postService.getUniquePost(id)
    }

    /**
     * Method that returns the most recommended posts in the appk
     * @param page indicates which page the user want to laod
     */
    @UseGuards(JwtAuthGuard)
    @Get('highlights')
    public async getHighlights(
        @Query('page') page: number
    ): Promise<BaseArrayProxy<PostProxy>> {
        return await this.postService.getHighlights(page)
    }

    /**
     * Method that can get the recomendations for each user, based on the category
     * @param category inidicates which category the user want
     * @param page indicates which page the user want to get
     */
    @UseGuards(JwtAuthGuard)
    @Get('categories')
    public async getByCategory(
        @Query('category') category: string,
        @Query('page') page: number
    ): Promise<BaseArrayProxy<PostProxy>> {
        return await this.postService.getByCategory(category, page)
    }

    /**
     * Method that can get the main post
     */
    @UseGuards(JwtAuthGuard)
    @Get('main')
    public async getMainPost(): Promise<PostProxy> {
        return await this.postService.getMainPost()
    }
}
