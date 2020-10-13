import {
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { AccountType } from 'src/models/enums/account.types'

import { CompetenceEntity } from 'src/typeorm/entities/competence.entity'
import { UserEntity } from 'src/typeorm/entities/user.entity'

import { CreateCompetencePayload } from '../models/create-competence.payload'
import { UserWithArrayProxy } from 'src/common/user-with-array-proxy'

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

    /**
     * Method that can register a competence in the database
     * @param userId stores the user id
     * @param createCompetencePayload stores the competence data
     */
    public async createCompetence(
        userId: string,
        createCompetencePayload: CreateCompetencePayload
    ): Promise<CompetenceEntity> {
        const user = await this.userService.getUserById(
            userId,
            AccountType.PERSONAL
        )
        if (!user) throw new NotFoundException('User not found')
        try {
            const { id } = await this.repository.save({
                ...createCompetencePayload,
                user
            })
            return await this.repository
                .createQueryBuilder('competences')
                .where({ id })
                .innerJoinAndSelect('competences.user', 'users')
                .innerJoinAndSelect('users.personalUser', 'personalusers.user')
                .leftJoinAndSelect('users.telephones', 'telephones.user')
                .leftJoinAndSelect('users.emails', 'emails.user')
                .getOne()
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    /**
     * Method that get a specific competence entity
     * @param id stores the competence id
     */
    public async getCompetencesById(id: string): Promise<CompetenceEntity> {
        const competences = await this.repository
            .createQueryBuilder('competences')
            .where({ id })
            .innerJoinAndSelect('competences.user', 'users')
            .innerJoinAndSelect('users.personalUser', 'personalusers.user')
            .leftJoinAndSelect('users.telephones', 'telephones.user')
            .leftJoinAndSelect('users.emails', 'emails.user')
            .getOne()
        if (!competences) throw new NotFoundException('Competences not found')
        return competences
    }

    /**
     * Method that can get all competences using the user id
     * @param userId stores the user id
     */
    public async getCompetences(
        userId: string
    ): Promise<UserWithArrayProxy<UserEntity, CompetenceEntity>> {
        const user = await this.userService.getUserById(
            userId,
            AccountType.PERSONAL
        )
        if (!user) throw new NotFoundException('User not found')
        const competences = await this.repository.find({ where: { user } })
        if (!competences) throw new NotFoundException('Competences not found')
        try {
            return {
                user,
                arrayProxy: {
                    length: competences.length,
                    array: competences
                }
            }
        } catch (error) {
            throw new NotFoundException(error)
        }
    }
}
