import {
    Entity,
    Column
} from "typeorm";

import { BaseEntity } from "src/common/base-entity";

@Entity('users')
export default class UserEntity extends BaseEntity{

    @Column({
        length: 100,
        unique: true
    })
    username: string

    @Column({
        length: 100,
        unique: true
    })
    password: string
}
