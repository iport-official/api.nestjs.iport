import { PostEntity } from 'src/typeorm/entities/post.entity'

import { PostProxy } from './post.proxy'
import { UserProxy } from 'src/modules/user/models/user.proxy'

export class CompletePostProxy extends PostProxy {
    user: UserProxy

    public constructor(entity: PostEntity) {
        super(entity)
        this.user = new UserProxy(entity.user)
    }
}
