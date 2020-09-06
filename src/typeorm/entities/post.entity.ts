import {
    Entity,
    Column,
    ManyToOne
} from "typeorm";

import { BaseEntity } from "src/common/base-entity";
import { UserEntity } from "./user.entity";

@Entity('posts')
export class PostEntity extends BaseEntity {

    @Column({
        type: "text"
    })
    image: string

    @Column({
        length: 100,
        nullable: false
    })
    title: string

    @Column({
        length: 1000,
        nullable: false
    })
    description: string

    @Column({
        length: 100,
        nullable: false
    })
    category: string

    @Column({
        type: "integer",
        default: 0
    })
    recomendation: number

    @Column({
        length: 100,
        nullable: false
    })
    contact: string

    @Column({
        type: "decimal",
        default: 0
    })
    salary: number

    @Column({
        nullable: false
    })
    post: string

    @Column({
        nullable: false
    })
    local: string

    @Column({
        nullable: false
    })
    requirements: string

    @Column({
        nullable: false
    })
    experienceLevel: string

    @Column({
        nullable: false,
    })
    vacancyDescription: string

    @ManyToOne(
        type => UserEntity,
        user => user.posts,
        {
            onDelete: 'CASCADE'
        })
    user: UserEntity
}
