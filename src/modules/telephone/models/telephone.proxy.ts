import { UserProxy } from "src/modules/user/models/user.proxy";
import { TelephoneEntity } from "src/typeorm/entities/telephone.entity";

export class TelephoneBaseProxy {

    id: string
    telephone: string
    createAt: Date
    updateAt: Date

    constructor(entity: TelephoneEntity) {
        this.id = entity.id
        this.telephone = entity.telephone
        this.createAt = entity.createAt
        this.updateAt = entity.createAt
    }

}

export class TelephoneProxy {

    user: UserProxy

    constructor(entity: TelephoneEntity) {
        this.user = new UserProxy(entity.user)
    }

}
