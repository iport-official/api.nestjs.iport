import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findOne({ email: username })
        console.log(user);
        if (user && user.password == password) {
            const { email, ...result } = user
            return result
        }
        return null
    }
}
