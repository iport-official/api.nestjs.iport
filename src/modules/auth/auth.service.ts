import { hash, compare } from 'bcrypt'
import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dto/register-dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    /**
     * Method that register the user in the database
     * It is resposible for encrypting the password before send it to the databse
     * Before return the new created user is changes the password to 'undefined'
     * @param registerUserDto store the data that will be used to create the new
     * user in the database
    */
    async register(registerUserDto: RegisterUserDto) {
        const hashedPassword = await hash(registerUserDto.password, 10);
        try {
            const createdUser = await this.userService.createUser({
                email: registerUserDto.email,
                password: hashedPassword,
            })
            createdUser.password = undefined
            return createdUser
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * Method that create a jwt (Json Web Token)
     * @param user store the data that will be used to crete the jwt
     */
    async login(user: { email: string, id: string }): Promise<{ access_token: string }> {
        return {
            access_token: this.jwtService.sign({
                email: user.email,
                sub: user.id
            })
        }
    }

    /**
     * Method that validate the user login
     * @param username store the username that will be validate
     * (in this case, by default, 'email')
     * @param password store the password that will be validated
     * (hashed)
     */
    async validateUser(username: string, password: string): Promise<any> {
        try {
            const user = await this.userService.findOne({ email: username })
            await this.verifyPassword(password, user.password)
            const { id, email } = user
            return { id, email }
        } catch (error) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST)
        }
    }

    //#region Utils

    /**
     * Method that validate the password
     * @param password store the password that is passing in request
     * @param hashedPassword store the password that is in the database
     */
    async verifyPassword(password: string, hashedPassword: string) {
        const isPasswordMatching = await compare(
            password,
            hashedPassword
        )
        if (!isPasswordMatching)
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST)
    }

    //#endregion
}
