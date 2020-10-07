import { BaseEntity } from 'src/common/base-entity'
import { Column, Entity, ManyToOne } from 'typeorm'
import { UserEntity } from './user.entity'

@Entity('projects')
export class ProjectEntity extends BaseEntity {
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
        type: 'datetime'
    })
    endDate: Date

    @Column({
        type: 'text'
    })
    description: string

    @ManyToOne(
        type => UserEntity,
        user => user.projects,
        {
            onDelete: 'CASCADE'
        }
    )
    user: UserEntity
}
