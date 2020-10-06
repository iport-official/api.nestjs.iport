import { Controller, UseGuards, Get } from '@nestjs/common'
import { RequestUser } from 'src/decorators/user.decorator'
import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard'
import { UpdateUserPayload } from '../models/update-user.payload'
import { CompleteUserProxy } from '../models/complete-user.proxy'

import { UserService } from '../services/user.service'

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
        @RequestUser() requestUser: { id: string }
    ): Promise<CompleteUserProxy> {
        const user = await this.userService.getProfile(requestUser.id)
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
        @RequestUser() requestUser: { id: string },
        updateUserPayload: UpdateUserPayload
    ): Promise<CompleteUserProxy> {
        const user = await this.userService.updateProfile(
            requestUser.id,
            updateUserPayload
        )
        return new CompleteUserProxy(user)
    }
}
