import { PersonalUserEntity } from '../../../typeorm/entities/personal-user.entity'

export class PersonalUserProxy {
    cpf: string
    status?: string
    job?: string
    highlights?: string

    public constructor(entity: PersonalUserEntity) {
        this.cpf = entity.cpf
        this.status = entity.status
        this.job = entity.job
        this.highlights = entity.highlights
    }
}
