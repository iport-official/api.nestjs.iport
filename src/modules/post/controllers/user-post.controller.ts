import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards
} from '@nestjs/common'

import { CreatePostPayload } from '../models/create-post.payload'
import { PostProxy } from '../models/post.proxy'
import { UpdatePostPayload } from '../models/update-post.payload'
import { ArrayProxy } from 'src/common/array-proxy'

import { UserPostService } from '../services/user-post.service'

import { RequestUserProperties } from 'src/common/jwt-validation-properties'
import { User } from 'src/decorators/user/user.decorator'
import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard'

@Controller('users/:userId/posts')
export class UserPostController {
    public constructor(private readonly userPostService: UserPostService) {}

    /**
     * Method that can register a post in the database
     * @param userId stores the user id
     * @param requestUser stores the basic user data
     * @param createPostPayload stores the post data
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    public async createPost(
        @Param('userId') userId: string,
        @User() requestUser: RequestUserProperties,
        @Body() createPostPayload: CreatePostPayload
    ): Promise<PostProxy> {
        const post = await this.userPostService.createPost(
            userId,
            requestUser,
            createPostPayload
        )
        return new PostProxy(post)
    }

    /**
     * Method that can return an unique post
     * @param id stores the post id
     */
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    public async getPostById(@Param('id') id: string): Promise<PostProxy> {
        const post = await this.userPostService.getPostById(id)
        return new PostProxy(post)
    }

    /**
     * Method that can return all thes posts of a specific user
     * @param userId stores the user id
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    public async getPostsByUserId(
        @Param('userId') userId: string
    ): Promise<ArrayProxy<PostProxy>> {
        const posts = await this.userPostService.getPostsByUserId(userId)
        return {
            length: posts.length,
            array: posts.array.map(post => new PostProxy(post))
        }
    }

    /**
     * Method that can update some post
     * @param id stores the post id
     * @param userId stores the user id
     * @param requestUser stores the user basic data
     * @param updatePostPayload stores the new post data
     */
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    public async updatePostById(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @User() requestUser: RequestUserProperties,
        @Body() updatePostPayload: UpdatePostPayload
    ): Promise<PostProxy> {
        const post = await this.userPostService.updatePostById(
            id,
            userId,
            requestUser,
            updatePostPayload
        )
        return new PostProxy(post)
    }

    /**
     * Method that can delete a specific post
     * @param id stores the post id
     * @param userId stores the user id
     * @param requestUser stores the basic user data
     */
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    public async deletePostById(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @User() requestUser: RequestUserProperties
    ): Promise<void> {
        await this.userPostService.deletePostById(id, userId, requestUser)
    }
}
