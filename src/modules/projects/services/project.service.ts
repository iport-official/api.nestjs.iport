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

import { ProjectEntity } from 'src/typeorm/entities/project.entity'
import { UserEntity } from 'src/typeorm/entities/user.entity'

import { CreateProjectPayload } from '../models/create-project.payload'
import { UpdateProjectPayload } from '../models/update-project.payload'
import { UserWithArrayProxy } from 'src/common/user-with-array-proxy'

import { UserService } from 'src/modules/user/services/user.service'

import { RequestUserProperties } from 'src/common/jwt-validation-properties'
import { Request } from 'supertest'

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
        const user = await this.userService.getUserById(
            userId,
            AccountType.PERSONAL
        )
        if (!user) throw new NotFoundException('User not found')
        try {
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
        const projects = await this.repository
            .createQueryBuilder('projects')
            .where({ id })
            .innerJoinAndSelect('projects.user', 'users')
            .innerJoinAndSelect('users.personalUser', 'personalusers.user')
            .leftJoinAndSelect('users.telephones', 'telephones.user')
            .leftJoinAndSelect('users.emails', 'emails.user')
            .getOne()
        if (!projects) throw new NotFoundException('Projects not found')
        return projects
    }

    /**
     * Method that can get all projects using the user id
     * @param userId stores the user id
     */
    public async getProjects(
        userId: string
    ): Promise<UserWithArrayProxy<UserEntity, ProjectEntity>> {
        const user = await this.userService.getUserById(
            userId,
            AccountType.PERSONAL
        )
        if (!user) throw new NotFoundException('User not found')
        const projects = await this.repository.find({ where: { user } })
        if (!projects) throw new NotFoundException('Projects not found')
        try {
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

    /**
     * Method that can delete some project
     * @param id stores the project id
     */
    public async deleteProjectById(id: string): Promise<DeleteResult> {
        try {
            return await this.repository.delete({ id })
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    /**
     * Method that can change a project data in the database
     * @param id stores the project id
     * @param userId stores the user id
     * @param requestUser stores the user basic data (from token)
     * @param updateProjectPayload stores the new project data
     */
    public async updateProject(
        id: string,
        userId: string,
        requestUser: RequestUserProperties,
        updateProjectPayload: UpdateProjectPayload
    ): Promise<ProjectEntity> {
        if (!UserService.hasPermissionToUpdate(requestUser, userId))
            throw new ForbiddenException(
                "You don't have permission to update the informations of this user"
            )

        return await this.repository.save({
            id,
            ...updateProjectPayload
        })
    }

    /**
     * Method that can remove a project from the database
     * @param id stores the project id
     * @param userId stores the user id
     * @param requestUser stores the user basic data (from token)
     */
    public async deleteProject(
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
