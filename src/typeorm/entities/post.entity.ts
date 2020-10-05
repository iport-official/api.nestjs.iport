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
        type: 'text'
    })
    image: string

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    title: string

    @Column({
        type: 'text',
        nullable: false
    })
    description: string

    @Column({
        type: "integer",
        default: 0
    })
    recommendations: number

    @Column({
        type: "integer",
        default: 0
    })
    likes: number

    @Column({
        type: 'varchar',
        length: 30,
        nullable: false
    })
    category: string

    @Column({
        type: "decimal",
        default: 0
    })
    salary: number

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    post: string

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false
    })
    local: string

    @Column({
        type: 'text',
        nullable: false
    })
    requirements: string

    @Column({
        type: 'varchar',
        length: 60,
        nullable: false
    })
    experienceLevel: string

    @Column({
        type: 'text',
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
