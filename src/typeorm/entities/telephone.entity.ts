import { Entity, Column, ManyToOne } from 'typeorm'

import { UserEntity } from './user.entity'
import { BaseEntity } from 'src/common/base-entity'

@Entity('telephones')
export class TelephoneEntity extends BaseEntity {
    @Column({
        type: 'varchar',
        length: 50,
        nullable: false
    })
    telephone: string

    @ManyToOne(
        type => UserEntity,
        user => user.telephones,
        {
            onDelete: 'CASCADE'
        }
    )
    user: UserEntity
}
