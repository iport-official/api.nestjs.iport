import { CompleteUserProxy } from 'src/modules/user/models/complete-user.proxy'
import { ProjectEntity } from 'src/typeorm/entities/project.entity'

export class ProjectProxy {
    id: string
    image: string
    title: string
    startDate: Date
    endDate: Date
    description: string
    user: CompleteUserProxy

    public constructor(entity: ProjectEntity) {
        this.id = entity.id
        this.title = entity.title
        this.startDate = entity.startDate
        this.endDate = entity.endDate
        this.description = entity.description
        this.user = new CompleteUserProxy(entity.user)
        this.image = entity.image
    }
}
