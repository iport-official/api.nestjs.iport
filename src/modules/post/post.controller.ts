import { Controller, Body, Post } from '@nestjs/common';
import { PostService } from './post.service';
import PostInteface from './interfaces/PostInterface'

@Controller('posts')
export class PostController {
    constructor(public postService: PostService) { }

    @Post()
    createPost(@Body() postInterface: PostInteface) {
        return this.postService.createPost(postInterface)
    }
}
