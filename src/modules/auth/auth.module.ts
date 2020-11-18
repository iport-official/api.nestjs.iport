import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { AuthController } from './controllers/auth.controller'

import { AuthService } from './services/auth.service'

import { EmailModule } from '../email/email.module'
import { TelephoneModule } from '../telephone/telephone.module'
import { UserModule } from '../user/user.module'
import { JwtStrategy } from './strategy/jwt.strategy'
import { LocalStrategy } from './strategy/local.strategy'

@Module({
    imports: [
        forwardRef(() => UserModule),
        PassportModule,
        forwardRef(() => TelephoneModule),
        EmailModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' }
        })
    ],
    controllers: [AuthController],
    providers: [JwtStrategy, LocalStrategy, AuthService],
    exports: [AuthService, JwtModule]
})
export class AuthModule {}
