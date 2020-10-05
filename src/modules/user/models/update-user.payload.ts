import { AccountType } from 'src/models/enums/account.types'

export class UpdateUserPayload {
    profileImage?: string
    email?: string
    password?: string
    accountType?: AccountType
    username?: string
    cpf?: string
    cnpj?: string
    cep?: string
    telephones?: string[]
    emails?: string[]
}
