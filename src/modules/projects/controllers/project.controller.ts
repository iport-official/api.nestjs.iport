import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { ValidationProperties } from 'src/common/jwt-validation-properties'
import { RequestUser } from 'src/decorators/user.decorator'
import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard'
import { CreateProjectPayload } from '../models/create-project.payload'
import { CreateProjectProxy } from '../models/create-project.proxy'
import { ProjectProxy } from '../models/project.proxy'
import { ProjectService } from '../services/project.service'

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
    ): Promise<ProjectProxy> {
        const project = await this.projectService.getProjectById(id)
        return new ProjectProxy(project)
    }
}
