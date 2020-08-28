import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import UserInterface from './interfaces/UserInterface';

@Controller('users')
export class UserController{
    constructor(public userService: UserService) { }

    @Post()
    createUser(@Body() userInterface: UserInterface) {
        this.userService.createUser(userInterface)
    }
}
