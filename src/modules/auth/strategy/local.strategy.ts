import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { AuthService } from '../services/auth.service'

import { Strategy } from 'passport-local'
import { ValidationProperties } from 'src/common/jwt-validation-properties'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    public constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password'
        })
    }

    /**
     * Method that can validate the request credentials
     * @param username stores the username that will be tested in the database (in this case the email)
     * @param password stores the password that will be tested in the database
     */
    public async validate(
        username: string,
        password: string
    ): Promise<ValidationProperties> {
        return await this.authService.validateUser(username, password)
    }
}
