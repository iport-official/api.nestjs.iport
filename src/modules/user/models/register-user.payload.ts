import { AccountType } from "src/models/enums/account.types"

export class RegisterUserPayload {

    profileImage: string
    email: string
    accountType: AccountType
    username: string
    password: string

}
