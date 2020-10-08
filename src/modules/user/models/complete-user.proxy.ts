import { AccountType } from 'src/models/enums/account.types'

import { UserEntity } from 'src/typeorm/entities/user.entity'

import { CompanyUserProxy } from './company-user.proxy'
import { PersonalUserProxy } from './personal-user.proxy'
import { BasicUserProxy } from './simple-user.proxy'
import { BaseArrayProxy } from 'src/common/base-array-proxy'

export class CompleteUserProxy extends BasicUserProxy {
    content: PersonalUserProxy | CompanyUserProxy
    telephones: BaseArrayProxy<string>
    emails: BaseArrayProxy<string>

    public constructor(entity: UserEntity) {
        super(entity)

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
