import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { BaseEntity } from '../../common/base-entity'
import { UserEntity } from './user.entity'

@Entity('personalusers')
export class PersonalUserEntity extends BaseEntity {
    @Column({
        type: 'varchar'
    })
    cpf: string

    @OneToOne(
        type => UserEntity,
        user => user.companyUser,
        {
            onDelete: 'CASCADE'
        }
    )
    @JoinColumn()
    user: UserEntity
}
