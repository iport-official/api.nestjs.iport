import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { ValidationProperties } from 'src/common/jwt-validation-properties'
import { UserService } from 'src/modules/user/services/user.service'
import { ProjectEntity } from 'src/typeorm/entities/project.entity'
import { UserEntity } from 'src/typeorm/entities/user.entity'
import { Repository } from 'typeorm'
import { CreateProjectPayload } from '../models/create-project.payload'

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
     * @param requestUser stores the user basic data (id, email, accountType)
     * @param createProjectPayload stores the new project data
     */
    public async createProject(
        requestUser: ValidationProperties,
        createProjectPayload: CreateProjectPayload
    ): Promise<ProjectEntity> {
        const user = await this.userService.getUserById(requestUser.id)
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
        const user = await this.userService.getProfile(project.user)
        project.user = user
        return project
    }

    /**
     * Method that can get all projects using the user data
     * @param id stores the user id
     */
    public async getProjectsByUserId(
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
