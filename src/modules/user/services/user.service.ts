import {
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { AccountType } from '../../../models/enums/account.types'

import { UserEntity } from '../../../typeorm/entities/user.entity'

import { RegisterCompanyUserPayload } from '../models/register-company-user.payload'
import { RegisterPersonalUserPayload } from '../models/register-personal-user.payload'
import { RegisterUserPayload } from '../models/register-user.payload'
import { UpdateUserPayload } from '../models/update-user.payload'

import { CompanyUserService } from './company-user.service'
import { PersonalUserService } from './personal-user.service'
import { EmailService } from 'src/modules/email/services/email.service'
import { TelephoneService } from 'src/modules/telephone/services/telephone.service'

import { RequestUserProperties } from 'src/common/jwt-validation-properties'

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
            throw new InternalServerErrorException(error)
        }
    }

    /**
     * Method that returns the user based on id
     * @param id stores the id of the user that will be searched
     */
    public async getMe(
        validationProperties: RequestUserProperties
    ): Promise<UserEntity> {
        try {
            const isPersonalAccount =
                validationProperties.accountType === AccountType.PERSONAL
            return await this.userRepository
                .createQueryBuilder('users')
                .where({ id: validationProperties.id })
                .leftJoinAndSelect('users.telephones', 'telephones.user')
                .leftJoinAndSelect('users.emails', 'emails.user')
                .innerJoinAndSelect(
                    isPersonalAccount
                        ? 'users.personalUser'
                        : 'users.companyUser',
                    isPersonalAccount
                        ? 'personalusers.user'
                        : 'companyusers.user'
                )
                .getOne()
        } catch (error) {
            throw new NotFoundException(error)
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
        try {
            const {
                profileImage,
                email,
                username,
                accountType,
                telephones,
                emails
            } = updateUserPayload

            const user = await this.getUserById(id)

            await this.telephoneService.deleteAllTelephonesByUser(user)
            await this.emailService.deleteAllEmailsUsingByUser(user)

            await this.telephoneService.registerTelephones(telephones, user)
            await this.emailService.registerEmails(emails, user)

            await this.userRepository
                .createQueryBuilder('users')
                .where({ id })
                .update({
                    profileImage,
                    email,
                    username,
                    accountType
                })
                .execute()

            return user
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    /**
     * Method that can return an UserEntity
     * @param id stores the user id
     */
    public async getUserById(id: string): Promise<UserEntity> {
        try {
            return await this.userRepository.findOne({ id })
        } catch (error) {
            throw new NotFoundException(error)
        }
    }
}
