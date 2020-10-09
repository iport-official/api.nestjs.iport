import { CompetenceEntity } from 'src/typeorm/entities/competence.entity'

export class CompetenceProxy {
    id: string
    label: string
    level: number

    public constructor(entity: CompetenceEntity) {
        this.id = entity.id
        this.label = entity.label
        this.level = entity.level
    }
}
