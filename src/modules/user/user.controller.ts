import { Controller, Post, Body } from '@nestjs/common';
import UserInterface from './interfaces/UserInterface';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UserController {
    constructor(
        private authService: AuthService
    ) { }

    /**
     * Method that can create a new user in the database
     * @param userInterface stores the user data that will be used to register
     */
    @Post()
    createUser(@Body() userInterface: UserInterface) {
        return this.authService.register(userInterface)
    }
}
