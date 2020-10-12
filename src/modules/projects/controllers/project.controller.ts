import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'

import { AccountType } from 'src/models/enums/account.types'

import { CreateProjectPayload } from '../models/create-project.payload'
import { CreateProjectProxy } from '../models/create-project.proxy'
import { ProjectProxy } from '../models/project.proxy'
import { ArrayProxy } from 'src/common/array-proxy'
import { UserProxy } from 'src/modules/user/models/user.proxy'

import { ProjectService } from '../services/project.service'

import { RequestUserProperties } from 'src/common/jwt-validation-properties'
import { Roles } from 'src/decorators/roles/roles.decorator'
import { RequestUser } from 'src/decorators/user/user.decorator'
import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard'
import { RolesGuard } from 'src/guards/roles/roles.guard'

@Controller('users/:userId/projects')
export class ProjectController {
    public constructor(private readonly projectService: ProjectService) {}

    /**
     * Method that can create a new project entity in the database
     * @param requestUser stores the user basic data (id, email, accountType)
     * @param createProjectPayload stores the new project data
     */
    @Roles(AccountType.PERSONAL)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Post()
    public async createProject(
        @RequestUser() requestUser: RequestUserProperties,
        @Body() createProjectPayload: CreateProjectPayload
    ): Promise<CreateProjectProxy> {
        const project = await this.projectService.createProject(
            requestUser.id,
            createProjectPayload
        )
        return new CreateProjectProxy(project)
    }

    /**
     * Method that can get a specific project entity
     * @param id stores the project id
     */
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    public async getProjectById(
        @Param('id') id: string
    ): Promise<ProjectProxy> {
        const project = await this.projectService.getProjectById(id)
        return new ProjectProxy(project)
    }

    /**
     * Method that can get all projects using the user data
     * @param requestUser stores the user data
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    public async getProjects(
        @Param('userId') userId: string
    ): Promise<{
        user: UserProxy
        projects: ArrayProxy<ProjectProxy>
    }> {
        const { user, projects } = await this.projectService.getProjects(userId)
        return {
            user: new UserProxy(user),
            projects: {
                length: projects.length,
                array: projects.map(project => new ProjectProxy(project))
            }
        }
    }
}
