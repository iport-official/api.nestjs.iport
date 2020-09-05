import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';

import { JwtAuthGuard } from '../../../guards/jwt/jwt-auth.guard';

@Controller('users')
export class UserController {
    constructor() { }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req: any) {
        return req.user
    }
}