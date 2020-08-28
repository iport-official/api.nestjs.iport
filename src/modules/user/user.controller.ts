import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController{
    constructor(public userService: UserService) { }

    @Post()
    createUser(@Body() createUserDto: { username: string, password: string }) {
        this.userService.createUser(createUserDto)
    }
}
