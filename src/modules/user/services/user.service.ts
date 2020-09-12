import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'

import { UserEntity } from 'src/typeorm/entities/user.entity';
import { RegisterUserPayload } from '../models/register-user.payload';
import { RegisterProxy } from 'src/modules/auth/models/register.proxy';

@Injectable()
export class UserService extends TypeOrmCrudService<UserEntity> {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>
    ) { super(repository) }

    /**
     * Method that create new users
     * @param registerPayload stores the new user data
     */
    public async createUser(registerUserPayload: RegisterUserPayload): Promise<RegisterProxy> {
        try {
            return await this.repository.save(registerUserPayload)
        } catch (error) {
            throw new NotFoundException();
        }
    }

}
