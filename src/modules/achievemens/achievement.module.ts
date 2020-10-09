import { Module } from '@nestjs/common'

import { AchievementController } from './controllers/achievement.controller'

import { AchievementService } from './services/achievements.service'

import { UserModule } from '../user/user.module'

@Module({
    imports: [UserModule],
    controllers: [AchievementController],
    providers: [AchievementService],
    exports: [AchievementService]
})
export class AchievementModule {}
