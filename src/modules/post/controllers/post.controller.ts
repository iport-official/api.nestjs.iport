import { Controller, Body, Post, UseGuards, Get, Query } from '@nestjs/common'

import { CreatePostPayload } from '../models/create-post.payload'
import { CompletePostProxy } from '../models/post.proxy'
import { BaseArrayProxy } from 'src/common/base-array-proxy'

import { PostService } from '../services/post.service'

import { JwtAuthGuard } from '../../../guards/jwt/jwt-auth.guard'
import { RequestUserProperties } from 'src/common/jwt-validation-properties'
import { RequestUser } from 'src/decorators/user.decorator'

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
        @RequestUser() requestUser: RequestUserProperties,
        @Body() createPostPayload: CreatePostPayload
    ): Promise<CompletePostProxy> {
        return await this.postService.createPost(requestUser, createPostPayload)
    }

    /**
     * Method that can return an unique post
     * @param id indicates which post the users wants to get
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    public async getUniquePost(
        @Query('id') id: string
    ): Promise<CompletePostProxy> {
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
    ): Promise<BaseArrayProxy<CompletePostProxy>> {
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
    ): Promise<BaseArrayProxy<CompletePostProxy>> {
        return await this.postService.getByCategory(category, page)
    }

    /**
     * Method that can get the main post
     */
    @UseGuards(JwtAuthGuard)
    @Get('main')
    public async getMainPost(): Promise<CompletePostProxy> {
        return await this.postService.getMainPost()
    }
}
