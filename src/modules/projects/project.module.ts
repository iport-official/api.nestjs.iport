import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProjectEntity } from 'src/typeorm/entities/project.entity'

import { ProjectController } from './controllers/project.controller'

import { ProjectService } from './services/project.service'

import { UserModule } from '../user/user.module'

@Module({
    imports: [UserModule, TypeOrmModule.forFeature([ProjectEntity])],
    providers: [ProjectService],
    controllers: [ProjectController],
    exports: [ProjectService]
})
export class ProjectModule {}
