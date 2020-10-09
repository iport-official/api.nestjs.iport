import { ExperienceEntity } from 'src/typeorm/entities/experience.entity'

import { BasicUserProxy } from 'src/modules/user/models/simple-user.proxy'

export class CreateExperienceProxy {
    id: string
    image: string
    title: string
    startDate: Date
    endDate: Date
    description: string
    user: BasicUserProxy

    public constructor(entity: ExperienceEntity) {
        this.id = entity.id
        this.title = entity.title
        this.startDate = entity.startDate
        this.endDate = entity.endDate
        this.description = entity.description
        this.user = new BasicUserProxy(entity.user)
        this.image = entity.image
    }
}
