import { ProjectEntity } from 'src/typeorm/entities/project.entity'

import { UserProxy } from 'src/modules/user/models/user.proxy'

export class CreateProjectProxy {
    id: string
    image: string
    title: string
    startDate: Date
    endDate: Date | null
    description: string
    user: UserProxy

    public constructor(entity: ProjectEntity) {
        this.id = entity.id
        this.title = entity.title
        this.startDate = entity.startDate
        this.endDate = entity.endDate
        this.description = entity.description
        this.user = new UserProxy(entity.user)
        this.image = entity.image
    }
}
