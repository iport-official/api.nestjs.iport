import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { DeleteResult, Not, Repository } from 'typeorm'

import { AccountType } from 'src/models/enums/account.types'

import { ExperienceEntity } from 'src/typeorm/entities/experience.entity'
import { UserEntity } from 'src/typeorm/entities/user.entity'

import { CreateExperiencePayload } from '../models/create-experience.payload'
import { UpdateExperiencePayload } from '../models/update-experience.payload'
import { UserWithArrayProxy } from 'src/common/user-with-array-proxy'

import { UserService } from 'src/modules/user/services/user.service'

import { RequestUserProperties } from 'src/common/jwt-validation-properties'

@Injectable()
export class ExperienceService extends TypeOrmCrudService<ExperienceEntity> {
    public constructor(
        @InjectRepository(ExperienceEntity)
        private readonly repository: Repository<ExperienceEntity>,
        private readonly userService: UserService
    ) {
        super(repository)
    }

    /**
     * Method that can register some experience in the database
     * @param userId stores the user id
     * @param createExperiencePayload stores the new data, that will be saved in the database
     */
    public async createExperience(
        userId: string,
        createExperiencePayload: CreateExperiencePayload
    ): Promise<ExperienceEntity> {
        const user = await this.userService.getUserById(
            userId,
            AccountType.PERSONAL
        )
        if (!user) throw new NotFoundException('User not found')
        try {
            const { id } = await this.repository.save({
                ...createExperiencePayload,
                user
            })
            return await this.repository
                .createQueryBuilder('experiences')
                .where({ id })
                .innerJoinAndSelect('experiences.user', 'users')
                .innerJoinAndSelect('users.personalUser', 'personalusers.user')
                .leftJoinAndSelect('users.telephones', 'telephones.user')
                .leftJoinAndSelect('users.emails', 'emails.user')
                .getOne()
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    /**
     * Method that can return a experience from a user just with it id
     * @param id stores the experience id
     */
    public async getExperienceById(id: string): Promise<ExperienceEntity> {
        const experiences = await this.repository
            .createQueryBuilder('experiences')
            .where({ id })
            .innerJoinAndSelect('experiences.user', 'users')
            .innerJoinAndSelect('users.personalUser', 'personalusers.user')
            .leftJoinAndSelect('users.telephones', 'telephones.user')
            .leftJoinAndSelect('users.emails', 'emails.user')
            .getOne()
        if (!experiences) throw new NotFoundException('Experience not found')
        return experiences
    }

    /**
     * Method that can get all the experiences from a user
     * @param userId stores the user id
     */
    public async getExperiences(
        userId: string
    ): Promise<UserWithArrayProxy<UserEntity, ExperienceEntity>> {
        const user = await this.userService.getUserById(
            userId,
            AccountType.PERSONAL
        )
        if (!user) throw new NotFoundException('User not found')
        const experiences = await this.repository.find({ where: { user } })
        if (!experiences) throw new NotFoundException('Experience not found')
        try {
            return {
                user,
                arrayProxy: {
                    length: experiences.length,
                    array: experiences
                }
            }
        } catch (error) {
            throw new NotFoundException(error)
        }
    }

    public async updateExperience(
        id: string,
        userId: string,
        requestUser: RequestUserProperties,
        updateExperiencePayload: UpdateExperiencePayload
    ): Promise<ExperienceEntity> {
        if (!UserService.hasPermissionToUpdate(requestUser, userId))
            throw new ForbiddenException(
                "You don't have permission to update the informations of this user"
            )

        return await this.repository.save({
            id,
            ...updateExperiencePayload
        })
    }

    public async deleteExperience(
        id: string,
        userId: string,
        requestUser: RequestUserProperties
    ): Promise<DeleteResult> {
        if (!UserService.hasPermissionToUpdate(requestUser, userId))
            throw new ForbiddenException(
                "You don't have permission to update the informations of this user"
            )

        return await this.repository.delete(id)
    }
}
