import { Controller, Body, Post, UseGuards, Get, Query } from '@nestjs/common'

import { AccountType } from 'src/models/enums/account.types'

import { CompletePostProxy } from '../models/complete-post.proxy'
import { CreatePostPayload } from '../models/create-post.payload'
import { ArrayProxy } from 'src/common/array-proxy'

import { PostService } from '../services/post.service'

import { JwtAuthGuard } from '../../../guards/jwt/jwt-auth.guard'
import { RequestUserProperties } from 'src/common/jwt-validation-properties'
import { Roles } from 'src/decorators/roles/roles.decorator'
import { RequestUser } from 'src/decorators/user/user.decorator'
import { RolesGuard } from 'src/guards/roles/roles.guard'

@Controller('posts')
export class PostController {
    public constructor(private readonly postService: PostService) {}

    /**
     * Method that can create posts
     * @param createPostPayload stores the post data before creating it
     */
    @Roles(AccountType.COMPANY)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Post()
    public async create(
        @RequestUser() requestUser: RequestUserProperties,
        @Body() createPostPayload: CreatePostPayload
    ): Promise<CompletePostProxy> {
        const post = await this.postService.createPost(
            requestUser,
            createPostPayload
        )
        return new CompletePostProxy(post)
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
        const post = await this.postService.getUniquePost(id)
        return new CompletePostProxy(post)
    }

    /**
     * Method that returns the most recommended posts in the appk
     * @param page indicates which page the user want to laod
     */
    @UseGuards(JwtAuthGuard)
    @Get('highlights')
    public async getHighlights(
        @Query('page') page: number
    ): Promise<ArrayProxy<CompletePostProxy>> {
        const posts = await this.postService.getHighlights(page)
        return {
            length: posts.length,
            array: posts.array.map(post => new CompletePostProxy(post))
        }
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
    ): Promise<ArrayProxy<CompletePostProxy>> {
        const posts = await this.postService.getByCategory(category, page)
        return {
            length: posts.length,
            array: posts.array.map(post => new CompletePostProxy(post))
        }
    }

    /**
     * Method that can get the main post
     */
    @UseGuards(JwtAuthGuard)
    @Get('main')
    public async getMainPost(): Promise<CompletePostProxy> {
        const post = await this.postService.getMainPost()
        return new CompletePostProxy(post)
    }
}
