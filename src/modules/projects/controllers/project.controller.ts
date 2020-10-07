import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard'
import { CreateProjectPayload } from '../models/create-project.payload'
import { CreateProjectProxy } from '../models/create-project.proxy'
import { ProjectProxy } from '../models/project.proxy'
import { ProjectService } from '../services/project.service'

@Controller('users/projects')
export class ProjectController {
    public constructor(private readonly projectService: ProjectService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    public async createProject(
        @Body() createProjectPayload: CreateProjectPayload
    ): Promise<CreateProjectProxy> {
        const project = await this.projectService.createProject(
            createProjectPayload
        )
        return new CreateProjectProxy(project)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    public async getProjectById(
        @Query('id') id: string
    ): Promise<ProjectProxy> {
        const project = await this.projectService.getProjectById(id)
        return new ProjectProxy(project)
    }
}
