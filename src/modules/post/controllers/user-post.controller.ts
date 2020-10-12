import { Controller, Get, Param, UseGuards } from '@nestjs/common'

import { PostProxy } from '../models/post.proxy'
import { ArrayProxy } from 'src/common/array-proxy'

import { PostService } from '../services/post.service'

import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard'

@Controller('users/:userId/posts')
export class UserPostController {
    public constructor(private readonly postService: PostService) {}

    /**
     * Method that can return all thes posts of a specific user
     * @param userId stores the user id
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    public async getPostsByUserId(
        @Param('userId') userId: string
    ): Promise<ArrayProxy<PostProxy>> {
        const posts = await this.postService.getPostsByUserId(userId)

        // console.log(posts.length)

        return {
            length: posts.length,
            array: posts.array.map(post => new PostProxy(post))
        }
    }
}
