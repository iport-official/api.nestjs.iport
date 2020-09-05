import {
    Controller,
    Body,
    Post,
    UseGuards,
    Get,
    Param,
    Query
} from '@nestjs/common';

import { PostService } from '../services/post.service';
import { CreatePostPayload } from '../models/create-post.payload';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PostProxy } from '../models/post.proxy';

@Controller('posts')
export class PostController {
    constructor(public postService: PostService) { }

    /**
     * Method that can create posts
     * @param postInterface stores the post data before creating it
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() postInterface: CreatePostPayload): Promise<PostProxy> {
        return await this.postService.create(postInterface)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/highlights')
    async getHighlights(@Query('page') page: number): Promise<PostProxy[]> {
        return await this.postService.getHighlights(page)
    }
}
