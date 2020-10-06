import { AccountType } from 'src/models/enums/account.types'
import { UserEntity } from 'src/typeorm/entities/user.entity'
import { PersonalUserProxy } from './personal-user.proxy'
import { CompanyUserProxy } from './company-user.proxy'
import { BaseArrayProxy } from 'src/common/base-array-proxy'

export class UserProxy {
    id: string
    email: string
    username: string
    accountType: AccountType
    createAt: Date
    updateAt: Date
    content: PersonalUserProxy | CompanyUserProxy
    telephones: BaseArrayProxy<string>
    emails: BaseArrayProxy<string>
    profileImage: string

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

        this.telephones = {
            length: entity.telephones.length,
            array: entity.telephones.map(
                telephoneEntity => telephoneEntity.telephone
            )
        }
        this.emails = {
            length: entity.emails.length,
            array: entity.emails.map(emailEntity => emailEntity.email)
        }
    }
}
