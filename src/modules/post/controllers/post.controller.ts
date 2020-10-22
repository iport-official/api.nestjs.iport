import { Controller, UseGuards, Get, Query, Param } from '@nestjs/common'

import { PostProxy } from '../models/post.proxy'
import { ArrayProxy } from 'src/common/array-proxy'

import { PostService } from '../services/post.service'

import { JwtAuthGuard } from '../../../guards/jwt/jwt-auth.guard'

@Controller('posts')
export class PostController {
    public constructor(private readonly postService: PostService) {}

    /**
     * Method that returns the most recommended posts in the appk
     * @param page indicates which page the user want to laod
     */
    @UseGuards(JwtAuthGuard)
    @Get('highlights')
    public async getHighlights(
        @Query('page') page: number
    ): Promise<ArrayProxy<PostProxy>> {
        const posts = await this.postService.getHighlights(page)
        return {
            length: posts.length,
            array: posts.array.map(post => new PostProxy(post))
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
    ): Promise<ArrayProxy<PostProxy>> {
        const posts = await this.postService.getByCategory(category, page)
        return {
            length: posts.length,
            array: posts.array.map(post => new PostProxy(post))
        }
    }

    /**
     * Method that can get the main post
     */
    @UseGuards(JwtAuthGuard)
    @Get('main')
    public async getMainPost(): Promise<PostProxy> {
        const post = await this.postService.getMainPost()
        return new PostProxy(post)
    }
}
