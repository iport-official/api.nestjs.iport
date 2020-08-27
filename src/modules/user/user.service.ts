import { response } from 'express';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'

import User from 'src/typeorm/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
    // constructor(@InjectRepository(User) public repository) {
    //     super(repository)
    // }

    // public async createUser(user: CreateUserDto) {
    //     try {
    //         const response = await this.repository.save(user)
    //     } catch (error) {
    //         return response;
    //     }
    // }
}
