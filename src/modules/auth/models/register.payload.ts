import { RegisterUserPayload } from "src/modules/user/models/register-user.payload"

export class RegisterPayload extends RegisterUserPayload { 

    telephones: string[]
    emails: string[]

}
