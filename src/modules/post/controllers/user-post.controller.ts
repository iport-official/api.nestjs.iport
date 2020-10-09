import { Controller, Get, Param, UseGuards } from '@nestjs/common'

import { PostProxy } from '../models/post.proxy'
import { ArrayProxy } from 'src/common/array-proxy'
import { UserProxy } from 'src/modules/user/models/user.proxy'

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
    ): Promise<{
        user: UserProxy
        posts: ArrayProxy<PostProxy>
    }> {
        const result = await this.postService.getPostsByUserId(userId)
        return {
            user: new UserProxy(result.user),
            posts: {
                length: result.posts.length,
                array: result.posts.map(post => new PostProxy(post))
            }
        }
    }
}
