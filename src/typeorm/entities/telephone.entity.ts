import { Entity, BaseEntity, Column, ManyToOne } from "typeorm";

import { UserEntity } from "./user.entity";

@Entity('telephones')
export class TelephoneEntity extends BaseEntity {

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false
    })
    telephoneNumber: string

    @ManyToOne(
        type => UserEntity,
        user => user.telephones,
        {
            onDelete: 'CASCADE'
        })
    user: UserEntity

}
