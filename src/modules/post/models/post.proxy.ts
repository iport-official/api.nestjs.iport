import { PostEntity } from 'src/typeorm/entities/post.entity'

import { PostProxy } from './basic-post.proxy'
import { BasicUserProxy } from 'src/modules/user/models/simple-user.proxy'

export class CompletePostProxy extends PostProxy {
    user: BasicUserProxy

    public constructor(entity: PostEntity) {
        super(entity)
        this.user = new BasicUserProxy(entity.user)
    }
}
