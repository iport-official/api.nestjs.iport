import { Controller, Post, Body, Request, UseGuards } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dto/register-dto";
import { LocalAuthGuard } from "../../guards/local/local-auth.guard";

@Controller('users')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post()
    register(@Body() credentials: RegisterUserDto) {
        return this.authService.register(credentials)
    }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Request() credentials: any) {
        return this.authService.login(credentials.user)
    }
}
