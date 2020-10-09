import { Controller, Get, Param, UseGuards } from '@nestjs/common'

import { PostProxy } from '../models/basic-post.proxy'
import { ArrayProxy } from 'src/common/array-proxy'
import { BasicUserProxy } from 'src/modules/user/models/simple-user.proxy'

import { PostService } from '../services/post.service'

import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard'

@Controller('users/:userId/posts')
export class UserPostController {
    public constructor(private readonly postService: PostService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    public async getPostsByUserId(
        @Param('userId') userId: string
    ): Promise<{
        user: BasicUserProxy
        posts: ArrayProxy<PostProxy>
    }> {
        const result = await this.postService.getPostsByUserId(userId)
        return {
            user: new BasicUserProxy(result.user),
            posts: {
                length: result.posts.length,
                array: result.posts.map(post => new PostProxy(post))
            }
        }
    }
}
