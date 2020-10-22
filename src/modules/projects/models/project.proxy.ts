import { ProjectEntity } from 'src/typeorm/entities/project.entity'

export class ProjectProxy {
    id: string
    image: string
    title: string
    startDate: Date
    endDate: Date | null
    description: string

    public constructor(entity: ProjectEntity) {
        this.id = entity.id
        this.title = entity.title
        this.startDate = entity.startDate
        this.endDate = entity.endDate
        this.description = entity.description
        this.image = entity.image
    }
}
