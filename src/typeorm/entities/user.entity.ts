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
        type: 'varchar',
        length: 50,
        unique: true,
        nullable: false
    })
    email: string

    @Column({
        type: 'varchar',
        length: 30,
        unique: true,
        nullable: false
    })
    username: string

    @Column({
        type: 'varchar',
        length: 200,
        nullable: false
    })
    password: string

    @OneToMany(type => PostEntity, post => post.user)
    posts: PostEntity[]

}
