import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

import { AuthService } from '../services/auth.service'
import { ValidationProperties } from 'src/common/jwt-validation-properties'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    public constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password'
        })
    }

    public async validate(
        username: string,
        password: string
    ): Promise<ValidationProperties> {
        return await this.authService.validateUser(username, password)
    }
}
