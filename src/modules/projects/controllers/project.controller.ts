import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'

import { BasicProjectProxy } from '../models/basic-project.proxy'
import { CompleteProjectProxy } from '../models/complete-project.proxy'
import { CreateProjectPayload } from '../models/create-project.payload'
import { CreateProjectProxy } from '../models/create-project.proxy'
import { BaseArrayProxy } from 'src/common/base-array-proxy'
import { BasicUserProxy } from 'src/modules/user/models/simple-user.proxy'

import { ProjectService } from '../services/project.service'

import { ValidationProperties } from 'src/common/jwt-validation-properties'
import { RequestUser } from 'src/decorators/user.decorator'
import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard'

@Controller('users/projects')
export class ProjectController {
    public constructor(private readonly projectService: ProjectService) {}

    /**
     * Method that can create a new project entity in the database
     * @param requestUser stores the user basic data (id, email, accountType)
     * @param createProjectPayload stores the new project data
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    public async createProject(
        @RequestUser() requestUser: ValidationProperties,
        @Body() createProjectPayload: CreateProjectPayload
    ): Promise<CreateProjectProxy> {
        const project = await this.projectService.createProject(
            requestUser,
            createProjectPayload
        )
        return new CreateProjectProxy(project)
    }

    /**
     * Method that can get a specific project entity
     * @param id stores the project id
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    public async getProjectById(
        @Query('id') id: string
    ): Promise<CompleteProjectProxy> {
        const project = await this.projectService.getProjectById(id)
        return new CompleteProjectProxy(project)
    }

    /**
     * Method that can get all projects using the user data
     * @param requestUser stores the user data
     */
    @UseGuards(JwtAuthGuard)
    @Get('/all')
    public async getProjectsByUserId(
        @RequestUser() requestUser: ValidationProperties
    ): Promise<{
        user: BasicUserProxy
        projects: BaseArrayProxy<BasicProjectProxy>
    }> {
        const {
            user,
            projects
        } = await this.projectService.getProjectsByUserId(requestUser.id)
        return {
            user: new BasicUserProxy(user),
            projects: {
                length: projects.length,
                array: projects.map(project => new BasicProjectProxy(project))
            }
        }
    }
}
