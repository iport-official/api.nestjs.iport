import { Column, Entity } from 'typeorm'

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
}
