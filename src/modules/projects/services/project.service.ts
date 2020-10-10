import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { ProjectEntity } from 'src/typeorm/entities/project.entity'
import { UserEntity } from 'src/typeorm/entities/user.entity'

import { CreateProjectPayload } from '../models/create-project.payload'

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
        userid: string,
        createProjectPayload: CreateProjectPayload
    ): Promise<ProjectEntity> {
        const user = await this.userService.getUserById(userid)
        return await this.repository.save({
            ...createProjectPayload,
            user
        })
    }

    /**
     * Method that can get a specific project entity
     * @param id stores the project id
     */
    public async getProjectById(id: string): Promise<ProjectEntity> {
        const project = await this.repository
            .createQueryBuilder('projects')
            .where({ id })
            .innerJoinAndSelect('projects.user', 'users.id')
            .getOne()
        const user = await this.userService.getMe(project.user)
        project.user = user
        return project
    }

    /**
     * Method that can get all projects using the user id
     * @param id stores the user id
     */
    public async getProjects(
        id: string
    ): Promise<{
        user: UserEntity
        projects: ProjectEntity[]
    }> {
        const user = await this.userService.getUserById(id)
        const projects = await this.repository.find({ where: { user } })
        return {
            user,
            projects
        }
    }
}
