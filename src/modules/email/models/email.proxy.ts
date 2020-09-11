import { RegisterProxy } from "src/modules/auth/models/register.proxy"
import { EmailEntity } from "src/typeorm/entities/email.entity"

export class EmailProxy {

    id: string
    email: string
    createAt: Date
    updateAt: Date
    user: RegisterProxy

    constructor(entity: EmailEntity) {
        this.id = entity.id
        this.email = entity.email
        this.createAt = entity.createAt
        this.updateAt = entity.updateAt
        this.user = new RegisterProxy(entity.user)
    }

}
