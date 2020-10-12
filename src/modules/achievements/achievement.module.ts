import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AchievementEntity } from 'src/typeorm/entities/achievement.entity'

import { AchievementController } from './controllers/achievement.controller'

import { AchievementService } from './services/achievement.service'

import { UserModule } from '../user/user.module'

@Module({
    imports: [UserModule, TypeOrmModule.forFeature([AchievementEntity])],
    controllers: [AchievementController],
    providers: [AchievementService],
    exports: [AchievementService]
})
export class AchievementModule {}
