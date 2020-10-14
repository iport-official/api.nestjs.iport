import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { DeleteResult, Repository } from 'typeorm'

import { AccountType } from '../../../models/enums/account.types'

import { UserEntity } from '../../../typeorm/entities/user.entity'

import { RegisterCompanyUserPayload } from '../models/register-company-user.payload'
import { RegisterPersonalUserPayload } from '../models/register-personal-user.payload'
import { RegisterUserPayload } from '../models/register-user.payload'
import { UpdateCompanyUserPayload } from '../models/update-company-user.payload'
import { UpdatePersonalUserPayload } from '../models/update-personal-user.payload'
import { UpdateUserPayload } from '../models/update-user.payload'

import { CompanyUserService } from './company-user.service'
import { PersonalUserService } from './personal-user.service'

import { RequestUserProperties } from 'src/common/jwt-validation-properties'

@Injectable()
export class UserService extends TypeOrmCrudService<UserEntity> {
    public constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly personalUserService: PersonalUserService,
        private readonly companyUserService: CompanyUserService
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
            const { content, ...rest } = registerUserPayload
            const isPersonalUser = rest.accountType === AccountType.PERSONAL
            const personalUser = isPersonalUser
                ? await this.personalUserService.createPersonalAccount(
                      content as RegisterPersonalUserPayload
                  )
                : null
            const companyUser = !isPersonalUser
                ? await this.companyUserService.createCompanyAccount(
                      content as RegisterCompanyUserPayload
                  )
                : null
            const user = await this.userRepository.save({
                ...rest,
                personalUser,
                companyUser
            })
            if (companyUser)
                this.companyUserService.updateCompanyUser(companyUser.id, {
                    user
                })
            else
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
        const me = await this.getUserById(
            validationProperties.id,
            validationProperties.accountType
        )
        if (!me) throw new NotFoundException('User not found')
        return me
    }

    /**
     * Method that can update the user data
     * @param userId stores the user id
     * @param updateUserPayload stores the new user's data
     */
    public async updateProfile(
        requestUser: RequestUserProperties,
        updateUserPayload: UpdateUserPayload
    ): Promise<UserEntity> {
        const user = await this.getUserById(requestUser.id)

        if (!UserService.hasPermissionToUpdate(requestUser, user.id))
            throw new ForbiddenException(
                "You don't have permission to update the informations of this user"
            )

        const { content, ...rest } = updateUserPayload

        if (!user) throw new NotFoundException('User not found')

        if (user.accountType === AccountType.PERSONAL) {
            const { personalUserId } = await this.userRepository
                .createQueryBuilder('users')
                .select('personalUserId')
                .where({ id: requestUser.id })
                .getRawOne<{ personalUserId: string }>()

            if (!personalUserId)
                throw new NotFoundException('Personal user account not found')

            this.personalUserService.updatePersonalUser(personalUserId, {
                ...content
            } as UpdatePersonalUserPayload)
        } else {
            const { companyUserId } = await this.userRepository
                .createQueryBuilder('users')
                .select('companyUserId')
                .where({ id: requestUser.id })
                .getRawOne<{ companyUserId: string }>()

            if (!companyUserId)
                throw new NotFoundException('Company user account not found')

            this.companyUserService.updateCompanyUser(companyUserId, {
                ...content
            } as UpdateCompanyUserPayload)
        }
        try {
            await this.userRepository.update(
                { id: requestUser.id },
                { ...rest }
            )
            return await this.getUserById(requestUser.id, user.accountType)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    /**
     * Method that can delete some user
     * @param id stores the user id
     */
    public async deleteUserById(
        requestUser: RequestUserProperties,
        id: string
    ): Promise<DeleteResult> {
        if (!UserService.hasPermissionToUpdate(requestUser, id))
            throw new ForbiddenException(
                "You don't have permission to update the informations of this user"
            )
        try {
            return await this.userRepository.delete({ id })
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    //#region Utils

    /**
     * Method that can return an UserEntity
     * @param id stores the user id
     */
    public async getUserById(
        id: string,
        accountType?: string
    ): Promise<UserEntity> {
        try {
            if (accountType) {
                const isPersonalAccount = accountType == AccountType.PERSONAL
                return await this.userRepository
                    .createQueryBuilder('users')
                    .where({ id })
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
            } else {
                return await this.userRepository
                    .createQueryBuilder('users')
                    .where({ id })
                    .leftJoinAndSelect('users.telephones', 'telephones.user')
                    .leftJoinAndSelect('users.emails', 'emails.user')
                    .getOne()
            }
        } catch (error) {
            throw new NotFoundException(error)
        }
    }

    /**
     * Method that can check if the user that is trying to access some specific route do have permission for doing it
     * @param requestUser stores the user data
     * @param id stores the target user id
     */
    private static hasPermissionToUpdate(
        requestUser: RequestUserProperties,
        id: string
    ): boolean {
        return (
            requestUser.id === id ||
            requestUser.accountType === AccountType.ADMIN
        )
    }

    //#endregion
}
