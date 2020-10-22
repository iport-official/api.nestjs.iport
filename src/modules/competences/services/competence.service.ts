import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { DeleteResult, Repository } from 'typeorm'

import { AccountType } from 'src/models/enums/account.types'

import { CompetenceEntity } from 'src/typeorm/entities/competence.entity'
import { UserEntity } from 'src/typeorm/entities/user.entity'

import { CreateCompetencePayload } from '../models/create-competence.payload'
import { UpdateCompetencePayload } from '../models/update-competence.payload'
import { UserWithArrayProxy } from 'src/common/user-with-array-proxy'

import { UserService } from 'src/modules/user/services/user.service'

import { RequestUserProperties } from 'src/common/jwt-validation-properties'

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

    public async updateCompetence(
        id: string,
        userId: string,
        requestUser: RequestUserProperties,
        updateCompetencePayload: UpdateCompetencePayload
    ): Promise<CompetenceEntity> {
        if (!UserService.hasPermissionToUpdate(requestUser, userId))
            throw new ForbiddenException(
                "You don't have permission to update the informations of this user"
            )

        return await this.repository.save({
            id,
            ...updateCompetencePayload
        })
    }

    public async deleteCompetence(
        id: string,
        userId: string,
        requestUser: RequestUserProperties
    ): Promise<DeleteResult> {
        if (!UserService.hasPermissionToUpdate(requestUser, userId))
            throw new ForbiddenException(
                "You don't have permission to update the informations of this user"
            )
        return await this.repository.delete(id)
    }
}
