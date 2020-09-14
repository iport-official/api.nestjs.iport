import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostEntity } from 'src/typeorm/entities/post.entity';

import { AuthService } from '../auth/services/auth.service';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';
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
