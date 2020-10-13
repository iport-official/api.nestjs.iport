import { AccountType } from 'src/models/enums/account.types'

import { UpdateCompanyUserPayload } from './update-company-user.payload'
import { UpdatePersonalUserPayload } from './update-personal-user.payload'

export class UpdateUserPayload {
    profileImage?: string
    email?: string
    password?: string
    username?: string
    city?: string
    state?: string
    accountType?: AccountType
    content?: UpdatePersonalUserPayload | UpdateCompanyUserPayload
    telephones?: string[]
    emails?: string[]
}
