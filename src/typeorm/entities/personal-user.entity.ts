import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../../common/base-entity'

@Entity('personalUsers')
export class PersonalUserEntity extends BaseEntity {
    @Column({
        type: 'varchar'
    })
    cpf: string
}
