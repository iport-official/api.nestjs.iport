import { Column, Entity, ManyToOne } from 'typeorm'

import { UserEntity } from './user.entity'
import { BaseEntity } from 'src/common/base-entity'

@Entity('experiences')
export class ExperienceEntity extends BaseEntity {
    @Column({
        type: 'text'
    })
    image: string

    @Column({
        type: 'varchar',
        length: 50
    })
    title: string

    @Column({
        type: 'datetime'
    })
    startDate: Date

    @Column({
        type: 'datetime',
        nullable: true
    })
    endDate: Date

    @Column({
        type: 'text'
    })
    description: string

    @ManyToOne(
        type => UserEntity,
        user => user.experiences,
        {
            onDelete: 'CASCADE'
        }
    )
    user: UserEntity
}
