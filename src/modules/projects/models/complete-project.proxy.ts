import { ProjectEntity } from 'src/typeorm/entities/project.entity'

import { ProjectProxy } from './project.proxy'
import { CompleteUserProxy } from 'src/modules/user/models/complete-user.proxy'

export class CompleteProjectProxy extends ProjectProxy {
    user: CompleteUserProxy

    public constructor(entity: ProjectEntity) {
        super(entity)
        this.user = new CompleteUserProxy(entity.user)
    }
}
