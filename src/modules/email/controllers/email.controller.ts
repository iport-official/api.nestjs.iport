import { Controller, UseGuards, Post, Body } from "@nestjs/common";
import { JwtAuthGuard } from "src/guards/jwt/jwt-auth.guard";
import { BaseArrayProxy } from "src/common/base-array-proxy";
import { EmailService } from "../services/email.service";
import { EmailPayload } from "../models/email.payload";
import { EmailProxy } from "../models/email.proxy";

@Controller('users/emails')
export class EmailController {

    constructor(
        private readonly emailService: EmailService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async registerEmails(@Body() emailPayload: EmailPayload): Promise<BaseArrayProxy<EmailProxy>> {
        return this.emailService.registerEmails(emailPayload);
    }

}
