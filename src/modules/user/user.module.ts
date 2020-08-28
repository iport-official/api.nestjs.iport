import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from 'src/typeorm/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([UserEntity])
    ],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule { }
