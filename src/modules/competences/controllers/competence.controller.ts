import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'

import { CompetenceProxy } from '../models/competence.proxy'
import { CreateCompetencePayload } from '../models/create-competence.payload'
import { ArrayProxy } from 'src/common/array-proxy'
import { UserProxy } from 'src/modules/user/models/user.proxy'

import { CompetenceService } from '../services/competence.service'

import { RequestUserProperties } from 'src/common/jwt-validation-properties'
import { RequestUser } from 'src/decorators/user.decorator'
import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard'


@Controller('users/:userId/competences')
export class CompetenceController {
    public constructor(private readonly competenceSercice: CompetenceService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    public async createCompetence(
        @RequestUser() requestUser: RequestUserProperties,
        @Body() createCompetencePayload: CreateCompetencePayload
    ): Promise<CompetenceProxy> {
        const competence = await this.competenceSercice.createCompetence(
            requestUser.id,
            createCompetencePayload
        )
        return new CompetenceProxy(competence)
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    public async getCompetenceById(
        @Param('id') id: string
    ): Promise<CompetenceProxy> {
        const competence = await this.competenceSercice.getCompetencesById(id)
        return new CompetenceProxy(competence)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    public async getCompetences(
        @Param('userId') userId: string
    ): Promise<{
        user: UserProxy
        competences: ArrayProxy<CompetenceProxy>
    }> {
        const {
            user,
            competences
        } = await this.competenceSercice.getCompetences(userId)
        return {
            user: new UserProxy(user),
            competences: {
                length: competences.length,
                array: competences.map(
                    competence => new CompetenceProxy(competence)
                )
            }
        }
    }
}
