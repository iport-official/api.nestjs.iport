import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { CompetenceEntity } from 'src/typeorm/entities/competence.entity'
import { UserEntity } from 'src/typeorm/entities/user.entity'

import { CreateCompetencePayload } from '../models/create-competence.payload'

import { UserService } from 'src/modules/user/services/user.service'

@Injectable()
export class CompetenceService extends TypeOrmCrudService<CompetenceEntity> {
    public constructor(
        @InjectRepository(CompetenceEntity)
        private readonly repository: Repository<CompetenceEntity>,
        private readonly userService: UserService
    ) {
        super(repository)
    }

    public async createCompetence(
        userId: string,
        createCompetencePayload: CreateCompetencePayload
    ): Promise<CompetenceEntity> {
        const user = await this.userService.getUserById(userId)
        return await this.repository.save({
            ...createCompetencePayload,
            user
        })
    }

    public async getCompetencesById(id: string): Promise<CompetenceEntity> {
        const competence = await this.repository
            .createQueryBuilder('competences')
            .where({ id })
            .innerJoinAndSelect('competences.user', 'users.id')
            .getOne()
        const user = await this.userService.getProfile(competence.user)
        competence.user = user
        return competence
    }

    public async getCompetences(
        userId: string
    ): Promise<{
        user: UserEntity
        competences: CompetenceEntity[]
    }> {
        const user = await this.userService.getUserById(userId)
        const competences = await this.repository.find({ where: { user } })
        return {
            user,
            competences
        }
    }
}
