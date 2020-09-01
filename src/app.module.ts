import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [
        UserModule,
        PostModule,
        AuthModule,
        TypeOrmModule.forRoot(),
    ],
    controllers: [
        AppController,
    ],
    providers: [
        AppService
    ],
})
export class AppModule { }
