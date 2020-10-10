import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'

import { AccountType } from 'src/models/enums/account.types'

import { AchievementProxy } from '../models/achievement.proxy'
import { CreateAchievementPayload } from '../models/create-achievement.payload'
import { ArrayProxy } from 'src/common/array-proxy'
import { UserProxy } from 'src/modules/user/models/user.proxy'

import { AchievementService } from '../services/achievement.service'

import { RequestUserProperties } from 'src/common/jwt-validation-properties'
import { Roles } from 'src/decorators/roles/roles.decorator'
import { RequestUser } from 'src/decorators/user/user.decorator'
import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard'
import { RolesGuard } from 'src/guards/roles/roles.guard'

@Controller('users/:userId/achievements')
export class AchievementController {
    public constructor(
        private readonly achievementService: AchievementService
    ) {}

    /**
     * Method that can create a new achievement entity in the database
     * @param requestUser stores the user basic data (id, email, accountType)
     * @param createAchievementPayload stores the new achievement data
     */
    @Roles(AccountType.PERSONAL)
    @UseGuards(RolesGuard)
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
        user: UserProxy
        achievements: ArrayProxy<AchievementProxy>
    }> {
        const {
            user,
            achievements
        } = await this.achievementService.getAchievements(userId)
        return {
            user: new UserProxy(user),
            achievements: {
                length: achievements.length,
                array: achievements.map(
                    achievement => new AchievementProxy(achievement)
                )
            }
        }
    }
}
