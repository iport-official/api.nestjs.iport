import { Controller, Body, Post, UseGuards } from '@nestjs/common';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post-dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('posts')
export class PostController {
    constructor(public postService: PostService) { }

    /**
     * Method that can create posts
     * @param postInterface stores the post data before creating it
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    createPost(@Body() postInterface: CreatePostDto) {
        return this.postService.createPost(postInterface)
    }
}
