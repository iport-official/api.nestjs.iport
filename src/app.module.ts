import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import UserEntity from './typeorm/entities/user.entity';
import PostEntity from './typeorm/entities/post.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            PostEntity
        ]),
        UserModule,
        PostModule,
        AuthModule,
    ],
    controllers: [
        AppController,
    ],
    providers: [
        AppService
    ],
})
export class AppModule { }
