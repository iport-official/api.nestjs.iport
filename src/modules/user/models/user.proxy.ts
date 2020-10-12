import { AccountType } from 'src/models/enums/account.types'

import { UserEntity } from 'src/typeorm/entities/user.entity'

import { CompanyUserProxy } from './company-user.proxy'
import { PersonalUserProxy } from './personal-user.proxy'
import { ArrayProxy } from 'src/common/array-proxy'

export class UserProxy {
    id: string
    email: string
    username: string
    accountType: AccountType
    createAt: Date
    updateAt: Date
    profileImage: string
    content: PersonalUserProxy | CompanyUserProxy
    telephones: ArrayProxy<string> | null
    emails: ArrayProxy<string> | null

    public constructor(entity: UserEntity) {
        this.id = entity.id
        this.email = entity.email
        this.username = entity.username
        this.accountType = entity.accountType
        this.createAt = entity.createAt
        this.updateAt = entity.updateAt
        this.profileImage = entity.profileImage

        this.content =
            entity.accountType === AccountType.PERSONAL
                ? new PersonalUserProxy(entity.personalUser)
                : new CompanyUserProxy(entity.companyUser)

        this.telephones = entity.telephones
            ? {
                  length: entity.telephones.length,
                  array: entity.telephones.map(
                      telephoneEntity => telephoneEntity.telephone
                  )
              }
            : null
        this.emails = entity.emails
            ? {
                  length: entity.emails.length,
                  array: entity.emails.map(emailEntity => emailEntity.email)
              }
            : null
    }
}
