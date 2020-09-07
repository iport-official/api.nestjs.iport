import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
    imports: [
        UserModule,
        PostModule,
        AuthModule,
        CategoryModule,
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
