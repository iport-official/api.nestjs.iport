import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { DeleteResult, Repository } from 'typeorm'

import { AccountType } from 'src/models/enums/account.types'

import { AchievementEntity } from 'src/typeorm/entities/achievement.entity'
import { UserEntity } from 'src/typeorm/entities/user.entity'

import { CreateAchievementPayload } from '../models/create-achievement.payload'
import { UpdateAchievementPayload } from '../models/update-achievement.payload'
import { UserWithArrayProxy } from 'src/common/user-with-array-proxy'

import { UserService } from 'src/modules/user/services/user.service'

import { RequestUserProperties } from 'src/common/jwt-validation-properties'

@Injectable()
export class AchievementService extends TypeOrmCrudService<AchievementEntity> {
    public constructor(
        @InjectRepository(AchievementEntity)
        private readonly repository: Repository<AchievementEntity>,
        private readonly userService: UserService
    ) {
        super(repository)
    }

    /**
     * Method that can create a new achievement entity in the database
     * @param userId stores the user id
     * @param createAchievementPayload stores the new achievement data
     */
    public async createAchievement(
        userId: string,
        createAchievementPayload: CreateAchievementPayload
    ): Promise<AchievementEntity> {
        const user = await this.userService.getUserById(
            userId,
            AccountType.PERSONAL
        )

        if (!user) throw new NotFoundException('User not found')

        try {
            const { id } = await this.repository.save({
                ...createAchievementPayload,
                user
            })
            return await this.repository
                .createQueryBuilder('achievements')
                .where({ id })
                .innerJoinAndSelect('achievements.user', 'users')
                .innerJoinAndSelect('users.personalUser', 'personalusers.user')
                .leftJoinAndSelect('users.telephones', 'telephones.user')
                .leftJoinAndSelect('users.emails', 'emails.user')
                .getOne()
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    /**
     * Method that can get a specific achievement entity
     * @param id stores the achievement id
     */
    public async getAchievementById(id: string): Promise<AchievementEntity> {
        try {
            return await this.repository
                .createQueryBuilder('achievements')
                .where({ id })
                .innerJoinAndSelect('achievements.user', 'users')
                .innerJoinAndSelect('users.personalUser', 'personalusers.user')
                .leftJoinAndSelect('users.telephones', 'telephones.user')
                .leftJoinAndSelect('users.emails', 'emails.user')
                .getOne()
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    /**
     * Method that can get all achievements using the user id
     * @param userId stores the user id
     */
    public async getAchievements(
        userId: string
    ): Promise<UserWithArrayProxy<UserEntity, AchievementEntity>> {
        const user = await this.userService.getUserById(
            userId,
            AccountType.PERSONAL
        )

        if (!user) throw new NotFoundException('User not found')

        try {
            const achievements = await this.repository.find({ where: { user } })
            return {
                user,
                arrayProxy: {
                    length: achievements.length,
                    array: achievements
                }
            }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    public async updateAchievement(
        id: string,
        userId: string,
        requestUser: RequestUserProperties,
        updateAchievementPayload: UpdateAchievementPayload
    ): Promise<AchievementEntity> {
        if (!UserService.hasPermissionToUpdate(requestUser, userId))
            throw new ForbiddenException(
                "You don't have permission to update the informations of this user"
            )

        return await this.repository.save({
            id,
            ...updateAchievementPayload
        })
    }

    public async deleteAchievement(
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
