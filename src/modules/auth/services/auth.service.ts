import {
    Injectable,
    Inject,
    forwardRef,
    InternalServerErrorException,
    UnauthorizedException,
    NotFoundException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { RegisterUserPayload } from '../../user/models/register-user.payload'
import { LoginProxy } from '../models/login.proxy'
import { UserProxy } from 'src/modules/user/models/user.proxy'

import { UserService } from '../../user/services/user.service'

import { hash, compare } from 'bcrypt'
import { RequestUserProperties } from 'src/common/jwt-validation-properties'

@Injectable()
export class AuthService {
    public constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    /**
     * Method that register the user in the database
     * It is responsible for encrypting the password before send it to the database
     * Before return the new created user is changes the password to 'undefined'
     * @param registerUserPayload stores the data that will be used to create the new
     * user in the database
     */
    public async register(
        registerUserPayload: RegisterUserPayload
    ): Promise<UserProxy> {
        let hashedPassword: string
        try {
            hashedPassword = await hash(registerUserPayload.password, 10)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
        const user = await this.userService.createUser({
            ...registerUserPayload,
            password: hashedPassword
        })
        if (!user) throw new NotFoundException('User not found')
        return new UserProxy(user)
    }

    /**
     * Method that create a jwt (Json Web Token)
     * @param user stores the data that will be used to crete the jwt
     */
    public async login(user: RequestUserProperties): Promise<LoginProxy> {
        try {
            const { id, email, accountType } = user
            return {
                access_token: await this.jwtService.signAsync({
                    id,
                    email,
                    accountType
                })
            }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    /**
     * Method that validate the user login
     * @param username stores the username that will be validate
     * (in this case, by default, 'email')
     * @param password stores the password that will be validated
     * (hashed)
     */
    public async validateUser(
        username: string,
        password: string
    ): Promise<RequestUserProperties> {
        const user = await this.userService.findOne({ email: username })
        if (!user) throw new NotFoundException('User not found')
        try {
            await this.verifyPassword(password, user.password)
            return {
                id: user.id,
                email: user.email,
                accountType: user.accountType
            }
        } catch (error) {
            throw new UnauthorizedException('Wrong credentials provided')
        }
    }

    //#region Utils

    /**
     * Method that validate the password
     * @param password stores the password that is passing in request
     * @param hashedPassword stores the password that is in the database
     */
    public async verifyPassword(
        password: string,
        hashedPassword: string
    ): Promise<void> {
        const isPasswordMatching = await compare(password, hashedPassword)
        if (!isPasswordMatching)
            throw new UnauthorizedException('Wrong credentials provided')
    }

    //#endregion
}
