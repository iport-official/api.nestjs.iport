import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostEntity } from 'src/typeorm/entities/post.entity';
import { AuthService } from '../auth/auth.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        TypeOrmModule.forFeature([PostEntity])
    ],
    providers: [
        PostService,
        AuthService
    ],
    exports: [PostService],
    controllers: [PostController]
})
export class PostModule { }
