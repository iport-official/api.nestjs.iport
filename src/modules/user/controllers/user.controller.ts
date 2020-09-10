import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';

import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    // @UseGuards(JwtAuthGuard)
    // @Get('profile')
    // async getProfile(): Promise<UserProfileProxy> {
    //     return await this.userService.getProfile()
    // }
}
