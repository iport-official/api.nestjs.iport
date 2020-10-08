import { ProjectEntity } from 'src/typeorm/entities/project.entity'

import { BasicProjectProxy } from './basic-project.proxy'
import { CompleteUserProxy } from 'src/modules/user/models/complete-user.proxy'

export class CompleteProjectProxy extends BasicProjectProxy {
    user: CompleteUserProxy

    public constructor(entity: ProjectEntity) {
        super(entity)
        this.user = new CompleteUserProxy(entity.user)
    }
}
