import {
    Entity,
    Column
} from "typeorm";

import { BaseEntity } from "src/common/base-entity";

@Entity('posts')
export class PostEntity extends BaseEntity {

    @Column({ default: "" })
    image01: string

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
    contact: string

    @Column({
        nullable: false
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
}
