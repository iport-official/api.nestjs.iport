import { Repository } from 'typeorm'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'

import { UserEntity } from 'src/typeorm/entities/user.entity'

import { RegisterUserPayload } from '../models/register-user.payload'
import { CompleteUserProxy } from '../models/complete-user.proxy'
import { UpdateUserPayload } from '../models/update-user.payload'
import { EmailService } from 'src/modules/email/services/email.service'
import { TelephoneService } from 'src/modules/telephone/services/telephone.service'
import { RegisterPersonalUserPayload } from '../models/register-personal-user.payload'
import { RegisterCompanyUserPayload } from '../models/register-company-user.payload'
import { PersonalUserService } from './personal-user.service'
import { CompanyUserService } from './company-user.service'
import { AccountType } from '../../../models/enums/account.types'

@Injectable()
export class UserService extends TypeOrmCrudService<UserEntity> {
    public constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly personalUserService: PersonalUserService,
        private readonly companyUserService: CompanyUserService,
        private readonly telephoneService: TelephoneService,
        private readonly emailService: EmailService
    ) {
        super(userRepository)
    }

    /**
     * Method that create new users
     * @param registerUserPayload stores the new user data
     */
    public async createUser(
        registerUserPayload: RegisterUserPayload
    ): Promise<UserEntity> {
        try {
            const {
                profileImage,
                email,
                password,
                accountType,
                username,
                city,
                state
            } = registerUserPayload

            const personalUser =
                accountType === AccountType.PERSONAL
                    ? await this.personalUserService.registerPersonalAccount(
                          registerUserPayload.content as RegisterPersonalUserPayload
                      )
                    : null

            const companyUser =
                accountType === AccountType.COMPANY
                    ? await this.companyUserService.registerCompanyAccount(
                          registerUserPayload.content as RegisterCompanyUserPayload
                      )
                    : null

            const user = await this.userRepository.save({
                profileImage,
                email,
                password,
                accountType,
                username,
                city,
                state,
                personalUser,
                companyUser
            })

            if (companyUser)
                this.companyUserService.updateCompanyUser(companyUser.id, {
                    user
                })
            if (personalUser)
                this.personalUserService.updatePersonalUser(personalUser.id, {
                    user
                })

            return user
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    /**
     * Method that returns the user based on id
     * @param id stores the id of the user that will be searched
     */
    public async getProfile(id: string): Promise<UserEntity> {
        try {
            const queryBuilder = this.userRepository
                .createQueryBuilder('users')
                .where({ id })

            const user = await queryBuilder.getOne()

            if (user.accountType == AccountType.COMPANY) {
                const companyUser = await queryBuilder
                    .innerJoinAndSelect('users.telephones', 'telephones.user')
                    .innerJoinAndSelect('users.emails', 'emails.user')
                    .innerJoinAndSelect(
                        'users.companyUser',
                        'companyusers.user'
                    )
                    .getOne()
                return companyUser
            } else {
                const personalUser = await queryBuilder
                    .innerJoinAndSelect('users.telephones', 'telephones.user')
                    .innerJoinAndSelect('users.emails', 'emails.user')
                    .innerJoinAndSelect(
                        'users.personalUser',
                        'personalusers.user'
                    )
                    .getOne()
                return personalUser
            }
        } catch (error) {
            console.log(error)
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
    }

    /**
     * Method that can update the user data
     * @param id indicates the which user will be updated
     * @param updateUserPayload indicates the new user's data
     */
    public async updateProfile(
        id: string,
        updateUserPayload: UpdateUserPayload
    ): Promise<UserEntity> {
        const {
            profileImage,
            email,
            username,
            accountType,
            telephones,
            emails
        } = updateUserPayload

        const queryBuilder = this.userRepository
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

        return user
    }
}
