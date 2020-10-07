import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { UserService } from 'src/modules/user/services/user.service'
import { ProjectEntity } from 'src/typeorm/entities/project.entity'
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

    public async createProject(
        createProjectPayload: CreateProjectPayload
    ): Promise<ProjectEntity> {
        const {
            image,
            title,
            startDate,
            endDate,
            description,
            userId
        } = createProjectPayload
        const user = await this.userService.getUserById(userId)
        return await this.repository.save({
            image,
            title,
            startDate,
            endDate,
            description,
            user
        })
    }

    public async getProjectById(id: string): Promise<ProjectEntity> {
        const project = await this.repository
            .createQueryBuilder('projects')
            .where({ id })
            .innerJoinAndSelect('projects.user', 'users.id')
            .getOne()
        const user = await this.userService.getProfile(project.user.id)
        project.user = user
        return project
    }
}
