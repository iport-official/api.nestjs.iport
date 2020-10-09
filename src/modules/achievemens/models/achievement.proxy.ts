import { AchievementEntity } from 'src/typeorm/entities/achievement.entity'

export class AchievementProxy {
    id: string
    image: string
    title: string
    endDate: Date
    description: string

    public constructor(entity: AchievementEntity) {
        this.id = entity.id
        this.image = entity.image
        this.title = entity.title
        this.endDate = entity.endDate
        this.description = entity.description
    }
}
