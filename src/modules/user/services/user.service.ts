import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'

import { UserEntity } from 'src/typeorm/entities/user.entity';

import { RegisterUserPayload } from '../models/register-user.payload';
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
     * @param registerUserPayload stores the new user data
     */
    async createUser(registerUserPayload: RegisterUserPayload): Promise<UserEntity> {
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
            return await this.repository.save({
                profileImage,
                email,
                password,
                accountType,
                username,
                cpf,
                cnpj,
                cep
            })
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

    /**
     * Method that can update the user data
     * @param id indicates the which user will be updated
     * @param updateUserPayload indicates the new user's data
     */
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

        const user = await queryBuilder.getOne()

        await this.telephoneService.deleteAllTelephonesByUser(user)
        await this.emailService.deleteAllEmailsUsingByUser(user)

        await this.telephoneService.registerTelephones(telephones, user)
        await this.emailService.registerEmails(emails, user)

        await queryBuilder
            .update({
                profileImage,
                email,
                username,
                accountType
            })
            .execute()

        return new UserProfileProxy(user)
    }

}
