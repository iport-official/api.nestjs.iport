import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UseGuards
} from '@nestjs/common'

import { ArrayProxy } from 'src/common/array-proxy'

import { EmailService } from '../services/email.service'

import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard'

@Controller('users/:userId/emails')
export class EmailController {
    public constructor(private readonly emailService: EmailService) {}

    /**
     * Method that allows creating emails and the associating them to users
     * @param emails stores an array with all the user emails
     * @param userId stores the user id
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    public async registerEmails(
        @Body() emails: string[],
        @Param('userId') userId: string
    ): Promise<ArrayProxy<string>> {
        const array = await this.emailService.registerEmails(emails, userId)
        return {
            length: array.length,
            array: array.map(element => element.email)
        }
    }

    /**
     * Method that can update all user's emails
     * @param emails stores an array of string representing the emails
     * @param userId stores the user id
     */
    @UseGuards(JwtAuthGuard)
    @Put()
    public async updateEmails(
        @Body() emails: string[],
        @Param('userId') userId: string
    ): Promise<ArrayProxy<string>> {
        const array = await this.emailService.updateEmails(emails, userId)
        return {
            length: array.length,
            array: array.map(element => element.email)
        }
    }

    /**
     * Method that can get the user's emails array
     * @param userId stores the user id
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    public async getEmails(
        @Param('userId') userId: string
    ): Promise<ArrayProxy<string>> {
        const array = await this.emailService.getEmailsFromUser(userId)
        return {
            length: array.length,
            array: array.map(element => element.email)
        }
    }
}
