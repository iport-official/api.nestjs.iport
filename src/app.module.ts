import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { PostController } from './modules/post/post.controller';
import { PostService } from './modules/post/post.service';
import { PostModule } from './modules/post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import UserEntity from './typeorm/entities/user.entity';
import PostEntity from './typeorm/entities/post.entity';

@Module({
    controllers: [AppController, PostController],
    providers: [AppService, PostService],
    imports: [
        UserModule,
        PostModule,
        TypeOrmModule.forFeature([
            UserEntity,
            PostEntity
        ]),
        AuthModule,],
})
export class AppModule { }
