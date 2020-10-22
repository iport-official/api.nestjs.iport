import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards
} from '@nestjs/common'
import { DeleteResult, UpdateResult } from 'typeorm'

import { AccountType } from 'src/models/enums/account.types'

import { AchievementProxy } from '../models/achievement.proxy'
import { CreateAchievementPayload } from '../models/create-achievement.payload'
import { UpdateAchievementPayload } from '../models/update-achievement.payload'
import { UserWithArrayProxy } from 'src/common/user-with-array-proxy'
import { UserProxy } from 'src/modules/user/models/user.proxy'

import { AchievementService } from '../services/achievement.service'
import { AuthService } from 'src/modules/auth/services/auth.service'

import { RequestUserProperties } from 'src/common/jwt-validation-properties'
import { Roles } from 'src/decorators/roles/roles.decorator'
import { User } from 'src/decorators/user/user.decorator'
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
        @User() requestUser: RequestUserProperties,
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
    ): Promise<UserWithArrayProxy<UserProxy, AchievementProxy>> {
        const {
            user,
            arrayProxy
        } = await this.achievementService.getAchievements(userId)
        return {
            user: new UserProxy(user),
            arrayProxy: {
                length: arrayProxy.length,
                array: arrayProxy.array.map(
                    achievement => new AchievementProxy(achievement)
                )
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    public async updateAchievement(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @User() requestUser: RequestUserProperties,
        @Body() updateAchievementPayload: UpdateAchievementPayload
    ): Promise<AchievementProxy> {
        const achievement = await this.achievementService.updateAchievement(
            id,
            userId,
            requestUser,
            updateAchievementPayload
        )
        return new AchievementProxy(achievement)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    public async deleteAchievement(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @User() requestUser: RequestUserProperties
    ): Promise<DeleteResult> {
        return await this.achievementService.deleteAchievement(
            id,
            userId,
            requestUser
        )
    }
}
