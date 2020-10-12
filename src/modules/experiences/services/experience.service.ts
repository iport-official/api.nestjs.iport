import {
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { ExperienceEntity } from 'src/typeorm/entities/experience.entity'
import { UserEntity } from 'src/typeorm/entities/user.entity'

import { CreateExperiencePayload } from '../models/create-experience.payload'
import { UserWithArrayProxy } from 'src/common/user-with-array-proxy'

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
            throw new InternalServerErrorException(error)
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
                .innerJoinAndSelect('users.personaUser', 'personalusers.user')
                .innerJoinAndSelect('users.telephones', 'telephones.user')
                .innerJoinAndSelect('users.emails', 'emails.user')
                .getOne()
            return experience
        } catch (error) {
            throw new NotFoundException(error)
        }
    }

    /**
     * Method that can get all the experiences from a user
     * @param userId stores the user id
     */
    public async getExperiences(
        userId: string
    ): Promise<UserWithArrayProxy<UserEntity, ExperienceEntity>> {
        try {
            const user = await this.userService.getUserById(userId)
            const experiences = await this.repository.find({ where: { user } })
            return {
                user,
                arrayProxy: {
                    length: experiences.length,
                    array: experiences
                }
            }
        } catch (error) {
            throw new NotFoundException(error)
        }
    }
}
