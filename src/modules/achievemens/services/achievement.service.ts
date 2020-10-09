import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { AchievementEntity } from 'src/typeorm/entities/achievement.entity'
import { UserEntity } from 'src/typeorm/entities/user.entity'

import { CreateAchievementPayload } from '../models/create-achievement.payload'

import { UserService } from 'src/modules/user/services/user.service'

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
        const user = await this.userService.getUserById(userId)
        return await this.repository.save({
            ...createAchievementPayload,
            user
        })
    }

    /**
     * Method that can get a specific achievement entity
     * @param id stores the achievement id
     */
    public async getAchievementById(id: string): Promise<AchievementEntity> {
        const achievement = await this.repository
            .createQueryBuilder('achievements')
            .where({ id })
            .innerJoinAndSelect('achievements.user', 'users.id')
            .getOne()
        const user = await this.userService.getProfile(achievement.user)
        achievement.user = user
        return achievement
    }

    /**
     * Method that can get all achievements using the user id
     * @param userId stores the user id
     */
    public async getAchievements(
        userId: string
    ): Promise<{
        user: UserEntity
        achievements: AchievementEntity[]
    }> {
        const user = await this.userService.getUserById(userId)
        const achievements = await this.repository.find({ where: { user } })
        return {
            user,
            achievements
        }
    }
}
