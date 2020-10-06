import { AccountType } from 'src/models/enums/account.types'
import { UserEntity } from 'src/typeorm/entities/user.entity'

export class BasicUserProxy {
    id: string
    email: string
    username: string
    accountType: AccountType
    createAt: Date
    updateAt: Date
    profileImage: string

    public constructor(entity: UserEntity) {
        this.id = entity.id
        this.email = entity.email
        this.username = entity.username
        this.accountType = entity.accountType
        this.createAt = entity.createAt
        this.updateAt = entity.updateAt
        this.profileImage = entity.profileImage
    }
}
