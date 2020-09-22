import { Controller, UseGuards, Get, Request, Patch, Body } from '@nestjs/common';
import { RequestUser } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard';
import { UserProxy } from '../models/user.proxy';

import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    /**
     * Method that returns the user based on id
     * @param user the basic user data, that will be used to get the complete user data
     */
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@RequestUser() user: { id: string }): Promise<UserProxy> {
        return await this.userService.getProfile(user.id)
    }
    
}
