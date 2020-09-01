import bcrypt from 'bcrypt'
import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from '../user/dto/registration-data.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService) )
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    /**
     * Method that register the user in the database
     * It is resposible for encrypting the password before send it to the databse
     * Before return the new created user is changes the password to 'undefined'
     * @param registrationData store the data that will be used to create the new
     * user in the database
    */
    async register(registrationData: RegisterUserDto) {
        const hashedPassword = await bcrypt.hash(registrationData.password, 10);
        console.log(hashedPassword)
        try {
            const createdUser = await this.userService.createUser({
                email: registrationData.email,
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
    async login(user: any) {
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

    /**
     * Method that validate the password
     * @param password store the password that is passing in request
     * @param hashedPassword store the password that is in the database
     */
    async verifyPassword(password: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(
            password,
            hashedPassword
        )
        if (!isPasswordMatching)
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST)
    }
}
