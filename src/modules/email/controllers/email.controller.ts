import { Controller, UseGuards, Post, Body } from "@nestjs/common";

import { JwtAuthGuard } from "src/guards/jwt/jwt-auth.guard";
import { BaseArrayProxy } from "src/common/base-array-proxy";
import { EmailPayload } from "../models/email.payload";
import { EmailProxy } from "../models/email.proxy";

import { EmailService } from "../services/email.service";

@Controller('users/emails')
export class EmailController {

    constructor(
        private readonly emailService: EmailService
    ) { }

    /**
     * Method that allows creating email and the associating them to users
     * @param emailPayload indicates the array of emails and the user id
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    async registerEmails(@Body() emailPayload: EmailPayload): Promise<BaseArrayProxy<EmailProxy>> {
        return this.emailService.registerEmails(emailPayload);
    }

}
