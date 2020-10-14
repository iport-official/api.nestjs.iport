import { UpdateCompanyUserPayload } from './update-company-user.payload'
import { UpdatePersonalUserPayload } from './update-personal-user.payload'

export class UpdateUserPayload {
    profileImage?: string
    email?: string
    username?: string
    city?: string
    state?: string
    content?: UpdatePersonalUserPayload | UpdateCompanyUserPayload
}
