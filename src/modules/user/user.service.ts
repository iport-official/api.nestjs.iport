import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'

import UserEntity from 'src/typeorm/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends TypeOrmCrudService<UserEntity> {
    constructor(
        @InjectRepository(UserEntity)
        private repository: Repository<UserEntity>
    ) { super(repository) }

    public async createUser(user: CreateUserDto) {
        try {
            const response = await this.repository.save(user)
            return response;
        } catch (error) {
            return error;
        }
    }
}