import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CompanyUserEntity } from '../../typeorm/entities/company-user.entity'
import { PersonalUserEntity } from '../../typeorm/entities/personal-user.entity'
import { UserEntity } from '../../typeorm/entities/user.entity'

import { UserController } from './controllers/user.controller'

import { AuthService } from '../auth/services/auth.service'
import { CompanyUserService } from './services/company-user.service'
import { PersonalUserService } from './services/personal-user.service'
import { UserService } from './services/user.service'

import { AuthModule } from '../auth/auth.module'
import { EmailModule } from '../email/email.module'
import { TelephoneModule } from '../telephone/telephone.module'

@Module({
    imports: [
        forwardRef(() => TelephoneModule),
        forwardRef(() => EmailModule),
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([
            UserEntity,
            PersonalUserEntity,
            CompanyUserEntity
        ])
    ],
    providers: [
        UserService,
        CompanyUserService,
        PersonalUserService,
        AuthService
    ],
    controllers: [UserController],
    exports: [UserService, CompanyUserService, PersonalUserService]
})
export class UserModule {}
