import { TelephoneEntity } from 'src/typeorm/entities/telephone.entity'

export class SimpleTelephoneProxy {
    id: string
    telephone: string
    createAt: Date
    updateAt: Date

    public constructor(entity: TelephoneEntity) {
        this.id = entity.id
        this.telephone = entity.telephone
        this.createAt = entity.createAt
        this.updateAt = entity.createAt
    }
}
