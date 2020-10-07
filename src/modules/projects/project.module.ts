import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectEntity } from 'src/typeorm/entities/project.entity'
import { UserModule } from '../user/user.module'
import { ProjectController } from './controllers/project.controller'
import { ProjectService } from './services/project.service'

@Module({
    imports: [UserModule, TypeOrmModule.forFeature([ProjectEntity])],
    providers: [ProjectService],
    controllers: [ProjectController],
    exports: [ProjectService]
})
export class ProjectModule {}
