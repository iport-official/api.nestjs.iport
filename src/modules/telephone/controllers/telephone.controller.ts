import { Controller } from "@nestjs/common";

@Controller('users/telephones')
export class TelephoneController {

    public constructor() { }

}

//#region Old code

// /**
//  * Mehtod that allows creating telephones and the associating them to users
//  * @param telephonePayload indicates the array of telephones and the user id
//  */
// @UseGuards(JwtAuthGuard)
// @Post()
// async registerTelephones(@Body() telephonePayload: TelephonePayload): Promise<BaseArrayProxy<TelephoneProxy>> {
//     return await this.telephoneService.registerTelephones(telephonePayload)
// }

//#endregion
