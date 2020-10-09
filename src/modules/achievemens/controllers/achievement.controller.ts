import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'

import { AchievementProxy } from '../models/achievement.proxy'
import { CreateAchievementPayload } from '../models/create-achievement.payload'
import { ArrayProxy } from 'src/common/array-proxy'
import { BasicUserProxy } from 'src/modules/user/models/simple-user.proxy'

import { AchievementService } from '../services/achievements.service'

import { RequestUserProperties } from 'src/common/jwt-validation-properties'
import { RequestUser } from 'src/decorators/user.decorator'
import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard'

@Controller()
export class AchievementController {
    public constructor(
        private readonly achievementService: AchievementService
    ) {}

    /**
     * Method that can create a new achievement entity in the database
     * @param requestUser stores the user basic data (id, email, accountType)
     * @param createAchievementPayload stores the new achievement data
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    public async createAchievement(
        @RequestUser() requestUser: RequestUserProperties,
        @Body() createAchievementPayload: CreateAchievementPayload
    ): Promise<AchievementProxy> {
        const achievement = await this.achievementService.createAchievement(
            requestUser.id,
            createAchievementPayload
        )
        return new AchievementProxy(achievement)
    }

    /**
     * Method that can get a specific achievement entity
     * @param id stores the achievement id
     */
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    public async getAchievementById(
        @Param('id') id: string
    ): Promise<AchievementProxy> {
        const achievement = await this.achievementService.getAchievementById(id)
        return new AchievementProxy(achievement)
    }

    /**
     * Method that can get all achievements using the user id
     * @param userId stores the user id
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    public async getAchievements(
        @Param('userId') userId: string
    ): Promise<{
        user: BasicUserProxy
        achievements: ArrayProxy<AchievementProxy>
    }> {
        const {
            user,
            achievements
        } = await this.achievementService.getAchievements(userId)
        return {
            user: new BasicUserProxy(user),
            achievements: {
                length: achievements.length,
                array: achievements.map(
                    achievement => new AchievementProxy(achievement)
                )
            }
        }
    }
}
