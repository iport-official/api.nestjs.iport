import { EmailEntity } from 'src/typeorm/entities/email.entity'

export class SimpleEmailProxy {
    id: string
    email: string
    createAt: Date
    updateAt: Date

    public constructor(entity: EmailEntity) {
        this.id = entity.id
        this.email = entity.email
        this.createAt = entity.createAt
        this.updateAt = entity.updateAt
    }
}
