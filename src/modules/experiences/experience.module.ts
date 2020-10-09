import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ExperienceEntity } from 'src/typeorm/entities/experience.entity'

import { ExperienceController } from './controllers/experience.controller'

import { ExperienceService } from './services/experience.service'

import { UserModule } from '../user/user.module'

@Module({
    imports: [UserModule, TypeOrmModule.forFeature([ExperienceEntity])],
    controllers: [ExperienceController],
    providers: [ExperienceService],
    exports: [ExperienceService]
})
export class ExperienceModule {}
