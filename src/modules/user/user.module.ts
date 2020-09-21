import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserEntity } from 'src/typeorm/entities/user.entity';
import { AuthService } from '../auth/services/auth.service';
import { AuthModule } from '../auth/auth.module';
import { TelephoneModule } from '../telephone/telephone.module';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => TelephoneModule),
        forwardRef(() => EmailModule),
        TypeOrmModule.forFeature([UserEntity]),
    ],
    providers: [
        UserService,
        AuthService,
    ],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule { }
