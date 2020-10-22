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

import { CompetenceProxy } from '../models/competence.proxy'
import { CreateCompetencePayload } from '../models/create-competence.payload'
import { UpdateCompetencePayload } from '../models/update-competence.payload'
import { UserWithArrayProxy } from 'src/common/user-with-array-proxy'
import { UserProxy } from 'src/modules/user/models/user.proxy'

import { CompetenceService } from '../services/competence.service'

import { RequestUserProperties } from 'src/common/jwt-validation-properties'
import { Roles } from 'src/decorators/roles/roles.decorator'
import { User } from 'src/decorators/user/user.decorator'
import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard'
import { RolesGuard } from 'src/guards/roles/roles.guard'

@Controller('users/:userId/competences')
export class CompetenceController {
    public constructor(private readonly competenceService: CompetenceService) {}

    /**
     * Method that can register a competence in the database
     * @param requestUser stores the user basic data (id, email, accountType)
     * @param createCompetencePayload stores the competence data
     */
    @Roles(AccountType.PERSONAL)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Post()
    public async createCompetence(
        @User() requestUser: RequestUserProperties,
        @Body() createCompetencePayload: CreateCompetencePayload
    ): Promise<CompetenceProxy> {
        const competence = await this.competenceService.createCompetence(
            requestUser.id,
            createCompetencePayload
        )
        return new CompetenceProxy(competence)
    }

    /**
     * Method that get a specific competence entity
     * @param id stores the competence id
     */
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    public async getCompetenceById(
        @Param('id') id: string
    ): Promise<CompetenceProxy> {
        const competence = await this.competenceService.getCompetencesById(id)
        return new CompetenceProxy(competence)
    }

    /**
     * Method that can get all competences using the user id
     * @param userId stores the user id
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    public async getCompetences(
        @Param('userId') userId: string
    ): Promise<UserWithArrayProxy<UserProxy, CompetenceProxy>> {
        const {
            user,
            arrayProxy
        } = await this.competenceService.getCompetences(userId)
        return {
            user: new UserProxy(user),
            arrayProxy: {
                length: arrayProxy.length,
                array: arrayProxy.array.map(
                    competence => new CompetenceProxy(competence)
                )
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    public async updateCompetence(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @User() requestUser: RequestUserProperties,
        @Body() updateCompetencePayload: UpdateCompetencePayload
    ): Promise<CompetenceProxy> {
        return await this.competenceService.updateCompetence(
            id,
            userId,
            requestUser,
            updateCompetencePayload
        )
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    public async deleteCompetence(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @User() requestUser: RequestUserProperties
    ): Promise<DeleteResult> {
        return await this.competenceService.deleteCompetence(
            id,
            userId,
            requestUser
        )
    }
}
