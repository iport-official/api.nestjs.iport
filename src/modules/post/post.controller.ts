import { Controller, Body, Post, Get, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import PostInteface from './interfaces/PostInterface'
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('posts')
export class PostController {
    constructor(public postService: PostService) { }

    /**
     * Method that can create posts
     * @param postInterface stores the post data before creating it
     */
    @Post()
    createPost(@Body() postInterface: PostInteface) {
        return this.postService.createPost(postInterface)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAllPosts() {
        return this.postService.getAllPosts()
    }
}
