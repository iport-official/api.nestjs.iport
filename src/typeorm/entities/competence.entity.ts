import { Column, Entity, ManyToOne } from 'typeorm'

import { UserEntity } from './user.entity'
import { BaseEntity } from 'src/common/base-entity'

@Entity('competences')
export class CompetenceEntity extends BaseEntity {
    @Column({
        type: 'varchar'
    })
    label: string

    @Column({
        type: 'int'
    })
    level: number

    @ManyToOne(
        type => UserEntity,
        user => user.competences,
        {
            onDelete: 'CASCADE'
        }
    )
    user: UserEntity
}
