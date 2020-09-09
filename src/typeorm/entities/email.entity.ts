import { Entity, BaseEntity, Column, ManyToOne } from "typeorm";

import { UserEntity } from "./user.entity";

@Entity('telephones')
export class EmailEntity extends BaseEntity {

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false
    })
    emailAddress: string

    @ManyToOne(
        type => UserEntity,
        user => user.emails,
        {
            onDelete: 'CASCADE'
        })
    user: UserEntity

}
