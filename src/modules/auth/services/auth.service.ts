import { hash, compare } from 'bcrypt'
import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../../user/services/user.service';
import { RegisterPayload } from '../models/register.payload';
import { LoginProxy } from '../models/login.proxy';
import { RegisterProxy } from '../models/register.proxy';

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
     * @param registerPayload stores the data that will be used to create the new
     * user in the database
    */
    async register(registerPayload: RegisterPayload): Promise<RegisterProxy> {
        const hashedPassword = await hash(registerPayload.password, 10);
        try {
            const {
                id,
                username,
                email,
                accountType,
                createAt,
                updateAt,
                profileImage
            } = await this.userService.createUser({
                ...registerPayload,
                password: hashedPassword
            })
            return {
                id,
                username,
                email,
                accountType,
                createAt,
                updateAt,
                profileImage
            }
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * Method that create a jwt (Json Web Token)
     * @param user stores the data that will be used to crete the jwt
     */
    async login(user: { email: string, id: string }): Promise<LoginProxy> {
        return {
            access_token: await this.jwtService.signAsync({
                email: user.email,
                sub: user.id
            })
        }
    }

    /**
     * Method that validate the user login
     * @param username stores the username that will be validate
     * (in this case, by default, 'email')
     * @param password stores the password that will be validated
     * (hashed)
     */
    async validateUser(username: string, password: string): Promise<{ id: string, email: string }> {
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
     * @param password stores the password that is passing in request
     * @param hashedPassword stores the password that is in the database
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
