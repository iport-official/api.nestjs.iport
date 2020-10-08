import { Controller, UseGuards, Get } from '@nestjs/common'

import { CompleteUserProxy } from '../models/complete-user.proxy'
import { UpdateUserPayload } from '../models/update-user.payload'

import { UserService } from '../services/user.service'

import { ValidationProperties } from 'src/common/jwt-validation-properties'
import { RequestUser } from 'src/decorators/user.decorator'
import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard'

@Controller('users')
export class UserController {
    public constructor(private readonly userService: UserService) {}

    /**
     * Method that returns the user based on id
     * @param requestUser the basic user data, that will be used to get the complete user data
     */
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    public async getProfile(
        @RequestUser() requestUser: ValidationProperties
    ): Promise<CompleteUserProxy> {
        const user = await this.userService.getProfile(requestUser)
        return new CompleteUserProxy(user)
    }

    /**
     * Method that can udpate the user data
     * @param id indicates which is the id of the user that will have him data changed
     * @param updateUserPayload indicates the new data of the user
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    public async updateProfile(
        @RequestUser() requestUser: ValidationProperties,
        updateUserPayload: UpdateUserPayload
    ): Promise<CompleteUserProxy> {
        const user = await this.userService.updateProfile(
            requestUser.id,
            updateUserPayload
        )
        return new CompleteUserProxy(user)
    }
}
