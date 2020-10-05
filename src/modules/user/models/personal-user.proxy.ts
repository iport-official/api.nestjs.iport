import { PersonalUserEntity } from '../../../typeorm/entities/personal-user.entity'

export class PersonalUserProxy {
    cpf: string

    public constructor(entity: PersonalUserEntity) {
        this.cpf = entity.cpf
    }
}
