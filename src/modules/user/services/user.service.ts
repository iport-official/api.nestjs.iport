import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'

import { UserEntity } from 'src/typeorm/entities/user.entity';

import { RegisterUserPayload } from '../models/register-user.payload';
import { RegisterProxy } from 'src/modules/auth/models/register.proxy';
import { UserProxy } from '../models/user.proxy';

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
    async createUser(registerUserPayload: RegisterUserPayload): Promise<RegisterProxy> {
        try {
            const {
                profileImage,
                email,
                password,
                accountType,
                username,
                cpf,
                cnpj,
                cep
            } = registerUserPayload
            const user = await this.repository.save({
                profileImage,
                email,
                password,
                accountType,
                username,
                cpf,
                cnpj,
                cep                
            })
            return new RegisterProxy(user)
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    /**
     * Method that returns the user based on id
     * @param id stores the id of the user that will be searched
     */
    async getProfile(id: string): Promise<UserProxy> {
        try {
            const user = await this.repository.findOne({ where: { id } })
            return new UserProxy(user)
        } catch (error) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
    }

}
