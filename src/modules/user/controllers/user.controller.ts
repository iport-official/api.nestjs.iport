import { Controller, UseGuards, Get } from '@nestjs/common'
import { RequestUser } from 'src/decorators/user.decorator'
import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard'
import { UpdateUserPayload } from '../models/update-user.payload'
import { UserProfileProxy } from '../models/user-profile.proxy'
import { UserProxy } from '../models/user.proxy'

import { UserService } from '../services/user.service'

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    /**
     * Method that returns the user based on id
     * @param user the basic user data, that will be used to get the complete user data
     */
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@RequestUser() user: { id: string }): Promise<UserProxy> {
        return await this.userService.getProfile(user.id)
    }

    /**
     * Method that can udpate the user data
     * @param id indicates which is the id of the user that will have him data changed
     * @param updateUserPayload indicates the new data of the user
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    async updateProfile(
        @RequestUser() user: { id: string },
        updateUserPayload: UpdateUserPayload
    ): Promise<UserProfileProxy> {
        return await this.userService.updateProfile(user.id, updateUserPayload)
    }
}
