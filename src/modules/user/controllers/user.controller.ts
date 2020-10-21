import {
    Controller,
    UseGuards,
    Get,
    Patch,
    Body,
    Param,
    Delete
} from '@nestjs/common'
import { DeleteResult } from 'typeorm'

import { UpdateUserPayload } from '../models/update-user.payload'
import { UserProxy } from '../models/user.proxy'

import { UserService } from '../services/user.service'

import { RequestUserProperties } from 'src/common/jwt-validation-properties'
import { User } from 'src/decorators/user/user.decorator'
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
        @User() requestUser: RequestUserProperties
    ): Promise<UserProxy> {
        const user = await this.userService.getMe(requestUser)
        return new UserProxy(user)
    }

    /**
     * Method that can udpate the user data
     * @param id indicates which is the id of the user that will have him data changed
     * @param updateUserPayload indicates the new data of the user
     */
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    public async updateProfile(
        @User() requestUser: RequestUserProperties,
        @Param('id') id: string,
        @Body() updateUserPayload: UpdateUserPayload
    ): Promise<UserProxy> {
        const user = await this.userService.updateProfile(
            requestUser,
            id,
            updateUserPayload
        )
        return new UserProxy(user)
    }

    /**
     * Method that can delete some user
     * @param id stores the user id
     */
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    public async deleteUserById(
        @User() requestUser: RequestUserProperties,
        @Param('id') id: string
    ): Promise<DeleteResult> {
        return await this.userService.deleteUserById(requestUser, id)
    }
}
