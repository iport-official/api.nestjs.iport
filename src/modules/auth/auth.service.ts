import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findOne({ email: username })
        if (user && user.password == password) {
            const { id, email } = user
            return { id, email }
        }
        return null
    }

    async login(user: any) {
        return {
            access_token: this.jwtService.sign({
                email: user.email,
                sub: user.id
            })
        }
    }
}
