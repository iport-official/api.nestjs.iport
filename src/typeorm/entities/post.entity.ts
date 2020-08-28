import {
    Entity,
    Column
} from "typeorm";

import { BaseEntity } from "src/common/base-entity";

@Entity('posts')
export default class PostEntity extends BaseEntity {

    @Column({ default: "" })
    image01: string

    @Column({ default: "" })
    image02: string

    @Column({ default: "" })
    image03: string

    @Column({ default: "" })
    image04: string

    @Column({ default: "" })
    image05: string

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
}
