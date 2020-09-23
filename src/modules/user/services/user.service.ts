import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'

import { UserEntity } from 'src/typeorm/entities/user.entity';

import { RegisterUserPayload } from '../models/register-user.payload';
import { RegisterProxy } from 'src/modules/auth/models/register.proxy';
import { UserProxy } from '../models/user.proxy';
import { UserProfileProxy } from '../models/user-profile.proxy';
import { UpdateUserPayload } from '../models/update-user.payload';
import { EmailService } from 'src/modules/email/services/email.service';
import { TelephoneService } from 'src/modules/telephone/services/telephone.service';

@Injectable()
export class UserService extends TypeOrmCrudService<UserEntity> {

    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
        private readonly telephoneService: TelephoneService,
        private readonly emailService: EmailService
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

    async updateProfile(
        id: string,
        updateUserPayload: UpdateUserPayload
    ): Promise<UserProfileProxy> {

        const {
            profileImage,
            email,
            username,
            accountType,
            cep,
            cnpj,
            cpf,
            telephones,
            emails
        } = updateUserPayload

        const queryBuilder = this.repository
            .createQueryBuilder('users')
            .where({ id })

        await this.telephoneService.deleteAllTelephonesUsingUserId(id)
        await this.emailService.deleteAllEmailsUsingUserID(id)

        await this.telephoneService.registerTelephones({
            userId: id,
            telephones
        })
        await this.emailService.registerEmails({
            userId: id,
            emails
        })

        await queryBuilder
            .update({
                profileImage,
                email,
                username,
                accountType,
                cep,
                cnpj,
                cpf,
            })
            .execute()

        const user = await queryBuilder.getOne()
        return new UserProfileProxy(user)
    }

}
