import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { LocalStrategy } from './strategy/local.strategy';
import { AuthService } from './services/auth.service';
import { jwtConstants } from './constants';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './controllers/auth.controller';

@Module({
    imports: [
        forwardRef(() => UserModule),
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1h' }
        })
    ],
    controllers: [
        AuthController
    ],
    providers: [
        JwtStrategy,
        LocalStrategy,
        AuthService,
    ],
    exports: [
        AuthService,
        JwtModule
    ],
})
export class AuthModule { }
