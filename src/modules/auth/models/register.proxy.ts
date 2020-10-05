import { UserProxy } from 'src/modules/user/models/user.proxy'
import { UserEntity } from 'src/typeorm/entities/user.entity'

export class RegisterProxy extends UserProxy {
    public constructor(entity: UserEntity) {
        super(entity)
    }
}
