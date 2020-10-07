import { hash, compare } from 'bcrypt'
import {
    Injectable,
    HttpException,
    HttpStatus,
    Inject,
    forwardRef
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UserService } from '../../user/services/user.service'
import { LoginProxy } from '../models/login.proxy'
import { TelephoneService } from 'src/modules/telephone/services/telephone.service'
import { EmailService } from 'src/modules/email/services/email.service'
import { RegisterUserPayload } from '../../user/models/register-user.payload'
import { CompleteUserProxy } from 'src/modules/user/models/complete-user.proxy'
import { ValidationProperties } from 'src/common/jwt-validation-properties'

@Injectable()
export class AuthService {
    public constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly telephoneService: TelephoneService,
        private readonly emailService: EmailService,
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
    ): Promise<CompleteUserProxy> {
        const hashedPassword = await hash(registerUserPayload.password, 10)
        try {
            const user = await this.userService.createUser({
                ...registerUserPayload,
                password: hashedPassword
            })

            await this.telephoneService.registerTelephones(
                registerUserPayload.telephones,
                user
            )
            await this.emailService.registerEmails(
                registerUserPayload.emails,
                user
            )

            return new CompleteUserProxy(user)
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    /**
     * Method that create a jwt (Json Web Token)
     * @param user stores the data that will be used to crete the jwt
     */
    public async login(user: ValidationProperties): Promise<LoginProxy> {
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
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
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
    ): Promise<ValidationProperties> {
        try {
            const {
                password: userPassword,
                id,
                email,
                accountType
            } = await this.userService.findOne({ email: username })
            await this.verifyPassword(password, userPassword)
            return { id, email, accountType }
        } catch (error) {
            throw new HttpException(
                'Wrong credentials provided',
                HttpStatus.UNAUTHORIZED
            )
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
            throw new HttpException(
                'Wrong credentials provided',
                HttpStatus.UNAUTHORIZED
            )
    }

    //#endregion
}
