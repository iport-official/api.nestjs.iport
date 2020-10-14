import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common'

import { RegisterUserPayload } from '../../user/models/register-user.payload'
import { LoginProxy } from '../models/login.proxy'
import { UserProxy } from 'src/modules/user/models/user.proxy'

import { AuthService } from '../services/auth.service'

import { LocalAuthGuard } from '../../../guards/local/local-auth.guard'
import { RequestUserProperties } from 'src/common/jwt-validation-properties'
import { User } from 'src/decorators/user/user.decorator'

@Controller('users')
export class AuthController {
    public constructor(private authService: AuthService) {}

    /**
     * Method that register the user in the database
     * It is responsible for encrypting the password before send it to the database
     * Before return the new created user is changes the password to 'undefined'
     * @param registerUserPayload stores the data that will be used to create a new user
     */
    @Post()
    public async register(
        @Body() registerUserPayload: RegisterUserPayload
    ): Promise<UserProxy> {
        return await this.authService.register(registerUserPayload)
    }

    /**
     * Method that create a jwt (Json Web Token)
     * @param credentials stores the data that will be used to crete the jwt
     */
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    @HttpCode(200)
    public async login(
        @User() user: RequestUserProperties
    ): Promise<LoginProxy> {
        return this.authService.login(user)
    }
}
