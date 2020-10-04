import { PersonalUserEntity } from '../../../typeorm/entities/personal-user.entity';

export class RegisterPersonalUserProxy {

    cpf: string

    public constructor (entity: PersonalUserEntity) {
        this.cpf = entity.cpf
    }
}
