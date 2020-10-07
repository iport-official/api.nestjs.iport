import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common'

import { AuthService } from '../services/auth.service'
import { LocalAuthGuard } from '../../../guards/local/local-auth.guard'
import { LoginProxy } from '../models/login.proxy'
import { RegisterUserPayload } from '../../user/models/register-user.payload'
import { CompleteUserProxy } from 'src/modules/user/models/complete-user.proxy'
import { RequestUser } from 'src/decorators/user.decorator'
import { ValidationProperties } from 'src/common/jwt-validation-properties'

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
    ): Promise<CompleteUserProxy> {
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
        @RequestUser() user: ValidationProperties
    ): Promise<LoginProxy> {
        return this.authService.login(user)
    }
}
