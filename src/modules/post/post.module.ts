import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PostEntity } from 'src/typeorm/entities/post.entity'

import { PostController } from './controllers/post.controller'
import { UserPostController } from './controllers/user-post.controller'

import { AuthService } from '../auth/services/auth.service'
import { PostService } from './services/post.service'
import { UserPostService } from './services/user-post.service'

import { AuthModule } from '../auth/auth.module'
import { EmailModule } from '../email/email.module'
import { TelephoneModule } from '../telephone/telephone.module'
import { UserModule } from '../user/user.module'

@Module({
    imports: [
        AuthModule,
        UserModule,
        TelephoneModule,
        EmailModule,
        TypeOrmModule.forFeature([PostEntity])
    ],
    providers: [PostService, UserPostService, AuthService],
    exports: [PostService],
    controllers: [PostController, UserPostController, UserPostController]
})
export class PostModule {}
