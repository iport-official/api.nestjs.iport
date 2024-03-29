import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards
} from '@nestjs/common'
import { DeleteResult } from 'typeorm'

import { AccountType } from 'src/models/enums/account.types'

import { CreateProjectPayload } from '../models/create-project.payload'
import { ProjectProxy } from '../models/project.proxy'
import { UpdateProjectPayload } from '../models/update-project.payload'
import { UserWithArrayProxy } from 'src/common/user-with-array-proxy'
import { UserProxy } from 'src/modules/user/models/user.proxy'

import { ProjectService } from '../services/project.service'

import { RequestUserProperties } from 'src/common/jwt-validation-properties'
import { Roles } from 'src/decorators/roles/roles.decorator'
import { User } from 'src/decorators/user/user.decorator'
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
        @User() requestUser: RequestUserProperties,
        @Body() createProjectPayload: CreateProjectPayload
    ): Promise<ProjectProxy> {
        const project = await this.projectService.createProject(
            requestUser.id,
            createProjectPayload
        )
        return new ProjectProxy(project)
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
    ): Promise<UserWithArrayProxy<UserProxy, ProjectProxy>> {
        const { user, arrayProxy } = await this.projectService.getProjects(
            userId
        )
        return {
            user: new UserProxy(user),
            arrayProxy: {
                length: arrayProxy.length,
                array: arrayProxy.array.map(
                    project => new ProjectProxy(project)
                )
            }
        }
    }

    /**
     * Method that can change a project data in the database
     * @param id stores the project id
     * @param userId stores the user id
     * @param requestUser stores the user basic data (from token)
     * @param updateProjectPayload stores the new project data
     */
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    public async updateProject(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @User() requestUser: RequestUserProperties,
        @Body() updateProjectPayload: UpdateProjectPayload
    ): Promise<ProjectProxy> {
        const project = await this.projectService.updateProject(
            id,
            userId,
            requestUser,
            updateProjectPayload
        )
        return new ProjectProxy(project)
    }

    /**
     * Method that can remove a project from the database
     * @param id stores the project id
     * @param userId stores the user id
     * @param requestUser stores the user basic data (from token)
     */
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    public async deleteProjectById(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @User() requestUser: RequestUserProperties
    ): Promise<DeleteResult> {
        return await this.projectService.deleteProject(id, userId, requestUser)
    }
}
