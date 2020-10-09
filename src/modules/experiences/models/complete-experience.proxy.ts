import { ExperienceEntity } from 'src/typeorm/entities/experience.entity'

import { BasicExperienceProxy } from './basic-experience.proxy'
import { CompleteUserProxy } from 'src/modules/user/models/complete-user.proxy'

export class CompleteExperienceProxy extends BasicExperienceProxy {
    user: CompleteUserProxy

    public constructor(entity: ExperienceEntity) {
        super(entity)
        this.user = new CompleteUserProxy(entity.user)
    }
}
