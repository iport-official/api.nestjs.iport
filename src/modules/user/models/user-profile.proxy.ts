import { UserEntity } from 'src/typeorm/entities/user.entity'
import { UserProxy } from './user.proxy'
import { EmailBaseProxy } from 'src/modules/email/models/email.proxy'
import { TelephoneBaseProxy } from 'src/modules/telephone/models/telephone.proxy'

export class UserProfileProxy extends UserProxy {
    telephones: TelephoneBaseProxy[]
    emails: EmailBaseProxy[]

    constructor(entity: UserEntity) {
        super(entity)
        this.telephones = entity.telephones.map(
            telephone => new TelephoneBaseProxy(telephone)
        )
        this.emails = entity.emails.map(email => new EmailBaseProxy(email))
    }
}
