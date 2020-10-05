import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserEntity } from 'src/typeorm/entities/user.entity';
import { AuthService } from '../auth/services/auth.service';
import { AuthModule } from '../auth/auth.module';
import { TelephoneModule } from '../telephone/telephone.module';
import { EmailModule } from '../email/email.module';
import { CompanyUserService } from './services/company-user.service';
import { PersonalUserService } from './services/personal-user.service';
import { CompanyUserEntity } from '../../typeorm/entities/company-user.entity';
import { PersonalUserEntity } from '../../typeorm/entities/personal-user.entity';

@Module({
    imports: [
        EmailModule,
        TelephoneModule,
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([
            UserEntity,
            PersonalUserEntity,
            CompanyUserEntity
        ]),
    ],
    providers: [
        UserService,
        CompanyUserService,
        PersonalUserService,
        AuthService,
    ],
    controllers: [UserController],
    exports: [
        UserService,
        CompanyUserService,
        PersonalUserService
    ],
})
export class UserModule { }
