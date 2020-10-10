import { Controller, UseGuards, Get, Put } from '@nestjs/common'

import { CompleteUserProxy } from '../models/complete-user.proxy'
import { UpdateUserPayload } from '../models/update-user.payload'

import { UserService } from '../services/user.service'

import { RequestUserProperties } from 'src/common/jwt-validation-properties'
import { RequestUser } from 'src/decorators/user/user.decorator'
import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard'

@Controller('users')
export class UserController {
    public constructor(private readonly userService: UserService) {}

    /**
     * Method that returns the user based on id
     * @param requestUser the basic user data, that will be used to get the complete user data
     */
    @UseGuards(JwtAuthGuard)
    @Get('me')
    public async getMe(
        @RequestUser() requestUser: RequestUserProperties
    ): Promise<CompleteUserProxy> {
        const user = await this.userService.getMe(requestUser)
        return new CompleteUserProxy(user)
    }

    /**
     * Method that can udpate the user data
     * @param id indicates which is the id of the user that will have him data changed
     * @param updateUserPayload indicates the new data of the user
     */
    @UseGuards(JwtAuthGuard)
    @Put()
    public async updateProfile(
        @RequestUser() requestUser: RequestUserProperties,
        updateUserPayload: UpdateUserPayload
    ): Promise<CompleteUserProxy> {
        const user = await this.userService.updateProfile(
            requestUser.id,
            updateUserPayload
        )
        return new CompleteUserProxy(user)
    }
}
