import { UserProxy } from "src/modules/user/models/user.proxy"
import { EmailEntity } from "src/typeorm/entities/email.entity"

export class EmailBaseProxy {

    id: string
    email: string
    createAt: Date
    updateAt: Date

    constructor(entity: EmailEntity) {
        this.id = entity.id
        this.email = entity.email
        this.createAt = entity.createAt
        this.updateAt = entity.updateAt
    }
}

export class EmailProxy extends EmailBaseProxy {

    user: UserProxy

    constructor(entity: EmailEntity) {
        super(entity)
        this.user = new UserProxy(entity.user)
    }

}
