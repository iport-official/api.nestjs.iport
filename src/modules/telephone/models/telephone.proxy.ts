import { RegisterProxy } from "src/modules/auth/models/register.proxy";
import { TelephoneEntity } from "src/typeorm/entities/telephone.entity";

export class TelephoneProxy {

    id: string
    telephone: string
    createAt: Date
    updateAt: Date
    user: RegisterProxy

    constructor(entity: TelephoneEntity) {
        this.id = entity.id
        this.telephone = entity.telephone
        this.createAt = entity.createAt
        this.updateAt = entity.createAt
        this.user = new RegisterProxy(entity.user)
    }

}
