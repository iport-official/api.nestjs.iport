import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { ExperienceEntity } from 'src/typeorm/entities/experience.entity'
import { UserEntity } from 'src/typeorm/entities/user.entity'

import { CreateExperiencePayload } from '../models/create-experience.payload'

import { UserService } from 'src/modules/user/services/user.service'

@Injectable()
export class ExperienceService extends TypeOrmCrudService<ExperienceEntity> {
    public constructor(
        @InjectRepository(ExperienceEntity)
        private readonly repository: Repository<ExperienceEntity>,
        private readonly userService: UserService
    ) {
        super(repository)
    }

    public async createExperience(
        id: string,
        createExperiencePayload: CreateExperiencePayload
    ): Promise<ExperienceEntity> {
        const user = await this.userService.getUserById(id)
        return await this.repository.save({
            ...createExperiencePayload,
            user
        })
    }

    public async getExperienceById(id: string): Promise<ExperienceEntity> {
        const experience = await this.repository
            .createQueryBuilder('experiences')
            .where({ id })
            .innerJoinAndSelect('experiences.user', 'users.id')
            .getOne()
        const user = await this.userService.getProfile(experience.user)
        experience.user = user
        return experience
    }

    public async getExperiences(
        id: string
    ): Promise<{
        user: UserEntity
        experiences: ExperienceEntity[]
    }> {
        const user = await this.userService.getUserById(id)
        const experiences = await this.repository.find({ where: { user } })
        return {
            user,
            experiences
        }
    }
}
