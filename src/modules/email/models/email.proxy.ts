import { EmailEntity } from 'src/typeorm/entities/email.entity'

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
