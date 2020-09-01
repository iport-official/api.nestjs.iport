import { Controller, Post, Body } from '@nestjs/common';
import UserInterface from './interfaces/UserInterface';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UserController {
    constructor(
        private authService: AuthService
    ) { }

    @Post()
    createUser(@Body() userInterface: UserInterface) {
        return this.authService.register(userInterface)
    }
}
