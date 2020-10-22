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
import { DeleteResult } from 'typeorm'

import { AccountType } from 'src/models/enums/account.types'

import { CreateExperiencePayload } from '../models/create-experience.payload'
import { ExperienceProxy } from '../models/experience.proxy'
import { UpdateExperiencePayload } from '../models/update-experience.payload'
import { UserWithArrayProxy } from 'src/common/user-with-array-proxy'
import { UserProxy } from 'src/modules/user/models/user.proxy'

import { ExperienceService } from '../services/experience.service'

import { RequestUserProperties } from 'src/common/jwt-validation-properties'
import { Roles } from 'src/decorators/roles/roles.decorator'
import { User } from 'src/decorators/user/user.decorator'
import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard'
import { RolesGuard } from 'src/guards/roles/roles.guard'

@Controller('users/:userId/experiences')
export class ExperienceController {
    public constructor(private readonly experienceService: ExperienceService) {}

    /**
     * Method that can register some experience in the database
     * @param requestUser stores the user basic data (id, email, accountType)
     * @param createExperiencePayload stores the new data, that will be saved in the database
     */
    @Roles(AccountType.PERSONAL)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Post()
    public async createExperience(
        @User() requestUser: RequestUserProperties,
        @Body() createExperiencePayload: CreateExperiencePayload
    ): Promise<ExperienceProxy> {
        const experience = await this.experienceService.createExperience(
            requestUser.id,
            createExperiencePayload
        )
        return new ExperienceProxy(experience)
    }

    /**
     * Method that can return a experience from a user just with it id
     * @param id stores the experience id
     */
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    public async getExperienceById(
        @Param('id') id: string
    ): Promise<ExperienceProxy> {
        const experience = await this.experienceService.getExperienceById(id)
        return new ExperienceProxy(experience)
    }

    /**
     * Method that can get all the experiences from a user
     * @param userId stores the user id
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    public async getExperiences(
        @Param('userId') userId: string
    ): Promise<UserWithArrayProxy<UserProxy, ExperienceProxy>> {
        const {
            user,
            arrayProxy
        } = await this.experienceService.getExperiences(userId)
        return {
            user: new UserProxy(user),
            arrayProxy: {
                length: arrayProxy.length,
                array: arrayProxy.array.map(
                    experience => new ExperienceProxy(experience)
                )
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    public async updateExperience(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @User() requestUser: RequestUserProperties,
        @Body() updateExperiencePayload: UpdateExperiencePayload
    ): Promise<ExperienceProxy> {
        const experience = await this.experienceService.updateExperience(
            id,
            userId,
            requestUser,
            updateExperiencePayload
        )
        return new ExperienceProxy(experience)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    public async deleteExperience(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @User() requestUser: RequestUserProperties
    ): Promise<DeleteResult> {
        return await this.experienceService.deleteExperience(
            id,
            userId,
            requestUser
        )
    }
}
