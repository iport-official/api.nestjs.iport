import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
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

    /**
     * Method that can register some experience in the database
     * @param id stores the user id
     * @param createExperiencePayload stores the new data, that will be saved in the database
     */
    public async createExperience(
        id: string,
        createExperiencePayload: CreateExperiencePayload
    ): Promise<ExperienceEntity> {
        try {
            const user = await this.userService.getUserById(id)
            return await this.repository.save({
                ...createExperiencePayload,
                user
            })
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    /**
     * Method that can return a experience from a user just with it id
     * @param id stores the experience id
     */
    public async getExperienceById(id: string): Promise<ExperienceEntity> {
        try {
            const experience = await this.repository
                .createQueryBuilder('experiences')
                .where({ id })
                .innerJoinAndSelect('experiences.user', 'users.id')
                .getOne()
            const user = await this.userService.getMe(experience.user)
            experience.user = user
            return experience
        } catch (error) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
    }

    /**
     * Method that can get all the experiences from a user
     * @param userId stores the user id
     */
    public async getExperiences(
        userId: string
    ): Promise<{
        user: UserEntity
        experiences: ExperienceEntity[]
    }> {
        try {
            const user = await this.userService.getUserById(userId)
            const experiences = await this.repository.find({ where: { user } })
            return {
                user,
                experiences
            }
        } catch (error) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
    }
}
