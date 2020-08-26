import { Injectable } from '@nestjs/common';

import { UserEntity } from '../../typeorm/entities/user.entity'

@Injectable()
export class UserService {
    createUser(userEntity: UserEntity) {

    }
}
