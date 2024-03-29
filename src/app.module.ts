import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppController } from './app.controller'

import { AppService } from './app.service'

import { AchievementModule } from './modules/achievements/achievement.module'
import { AuthModule } from './modules/auth/auth.module'
import { CategoryModule } from './modules/category/category.module'
import { CompetenceModule } from './modules/competences/competence.module'
import { EmailModule } from './modules/email/email.module'
import { ExperienceModule } from './modules/experiences/experience.module'
import { PostModule } from './modules/post/post.module'
import { ProjectModule } from './modules/projects/project.module'
import { TelephoneModule } from './modules/telephone/telephone.module'
import { UserModule } from './modules/user/user.module'

@Module({
    imports: [
        UserModule,
        PostModule,
        AuthModule,
        CategoryModule,
        TelephoneModule,
        EmailModule,
        ProjectModule,
        ExperienceModule,
        AchievementModule,
        CompetenceModule,
        TypeOrmModule.forRoot()
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
