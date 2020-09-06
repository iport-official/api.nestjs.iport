import {
    Entity,
    Column,
    OneToMany
} from "typeorm";

import { BaseEntity } from "src/common/base-entity";
import { PostEntity } from "./post.entity";

@Entity('users')
export class UserEntity extends BaseEntity{
    @Column({
        type: 'text'
    })
    profileImage: string

    @Column({
        length: 100,
        unique: true
    })
    email: string

    @Column({
        length: 100,
        unique: true
    })
    password: string

    @OneToMany(type => PostEntity, post => post.user)
    posts: PostEntity[]
}
