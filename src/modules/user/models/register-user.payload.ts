import { AccountType } from "src/models/enums/account.types"

export class RegisterUserPayload {

    profileImage: string
    email: string
    password: string
    accountType: AccountType
    username: string
    cpf: string
    cnpj: string
    cep: string

}
