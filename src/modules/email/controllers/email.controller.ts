import { Controller } from "@nestjs/common";

@Controller('users/emails')
export class EmailController {

    public constructor() { }

}

//#region Old code

// /**
//  * Method that allows creating email and the associating them to users
//  * @param emailPayload indicates the array of emails and the user id
//  */
// @UseGuards(JwtAuthGuard)
// @Post()
// async registerEmails(@Body() emailPayload: EmailPayload): Promise<BaseArrayProxy<EmailProxy>> {
//     return this.emailService.registerEmails(emailPayload);
// }

//#endregion
