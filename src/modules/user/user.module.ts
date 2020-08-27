import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/typeorm/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([User])
    ],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule { }
