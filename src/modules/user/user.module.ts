import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from 'src/typeorm/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([UserEntity])
    ],
    providers: [
        UserService,
        AuthService,
        JwtService
    ],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule { }
