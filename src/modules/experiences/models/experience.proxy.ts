import { ExperienceEntity } from 'src/typeorm/entities/experience.entity'

export class ExperienceProxy {
    id: string
    image: string
    title: string
    startDate: Date
    endDate: Date
    description: string

    public constructor(entity: ExperienceEntity) {
        this.id = entity.id
        this.image = entity.image
        this.title = entity.title
        this.startDate = entity.startDate
        this.endDate = entity.endDate
        this.description = entity.description
    }
}
