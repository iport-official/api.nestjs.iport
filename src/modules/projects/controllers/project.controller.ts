import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards
} from '@nestjs/common'
import { DeleteResult } from 'typeorm'

import { AccountType } from 'src/models/enums/account.types'

import { CreateProjectPayload } from '../models/create-project.payload'
import { CreateProjectProxy } from '../models/create-project.proxy'
import { ProjectProxy } from '../models/project.proxy'
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
     * Method that can delete some project
     * @param id stores the project id
     */
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    public async deleteProjectById(
        @Param('id') id: string
    ): Promise<DeleteResult> {
        return await this.projectService.deleteProjectById(id)
    }
}
