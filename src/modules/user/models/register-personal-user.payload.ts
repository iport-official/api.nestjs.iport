import { UserEntity } from '../../../typeorm/entities/user.entity';

export class RegisterPersonalUserPayload {
    cpf: string
    user: UserEntity
}
