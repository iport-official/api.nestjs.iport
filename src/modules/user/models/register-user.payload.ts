import { AccountType } from 'src/models/enums/account.types'
import { RegisterCompanyUserPayload } from './register-company-user.payload'
import { RegisterPersonalUserPayload } from './register-personal-user.payload'

export class RegisterUserPayload {
    profileImage: string
    email: string
    password: string
    username: string
    city: string
    state: string
    accountType: AccountType
    content: RegisterPersonalUserPayload | RegisterCompanyUserPayload
    telephones: string[]
    emails: string[]
}
