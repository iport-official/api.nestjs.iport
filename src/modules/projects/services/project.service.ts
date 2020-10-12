import {
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { AccountType } from 'src/models/enums/account.types'

import { ProjectEntity } from 'src/typeorm/entities/project.entity'
import { UserEntity } from 'src/typeorm/entities/user.entity'

import { CreateProjectPayload } from '../models/create-project.payload'
import { UserWithArrayProxy } from 'src/common/user-with-array-proxy'

import { UserService } from 'src/modules/user/services/user.service'

@Injectable()
export class ProjectService extends TypeOrmCrudService<ProjectEntity> {
    public constructor(
        @InjectRepository(ProjectEntity)
        private readonly repository: Repository<ProjectEntity>,
        private readonly userService: UserService
    ) {
        super(repository)
    }

    /**
     * Method that can create a new project entity in the database
     * @param userId stores the user id
     * @param createProjectPayload stores the new project data
     */
    public async createProject(
        userId: string,
        createProjectPayload: CreateProjectPayload
    ): Promise<ProjectEntity> {
        try {
            const user = await this.userService.getUserById(
                userId,
                AccountType.PERSONAL
            )
            const { id } = await this.repository.save({
                ...createProjectPayload,
                user
            })
            return await this.repository
                .createQueryBuilder('projects')
                .where({ id })
                .innerJoinAndSelect('projects.user', 'users')
                .innerJoinAndSelect('users.personalUser', 'personalusers.user')
                .leftJoinAndSelect('users.telephones', 'telephones.user')
                .leftJoinAndSelect('users.emails', 'emails.user')
                .getOne()
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    /**
     * Method that can get a specific project entity
     * @param id stores the project id
     */
    public async getProjectById(id: string): Promise<ProjectEntity> {
        try {
            return await this.repository
                .createQueryBuilder('projects')
                .where({ id })
                .innerJoinAndSelect('projects.user', 'users')
                .innerJoinAndSelect('users.personalUser', 'personalusers.user')
                .leftJoinAndSelect('users.telephones', 'telephones.user')
                .leftJoinAndSelect('users.emails', 'emails.user')
                .getOne()
        } catch (error) {
            throw new NotFoundException(error)
        }
    }

    /**
     * Method that can get all projects using the user id
     * @param userId stores the user id
     */
    public async getProjects(
        userId: string
    ): Promise<UserWithArrayProxy<UserEntity, ProjectEntity>> {
        try {
            const user = await this.userService.getUserById(
                userId,
                AccountType.PERSONAL
            )
            const projects = await this.repository.find({ where: { user } })
            return {
                user,
                arrayProxy: {
                    length: projects.length,
                    array: projects
                }
            }
        } catch (error) {
            throw new NotFoundException(error)
        }
    }
}
