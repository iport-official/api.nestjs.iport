import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { BaseEntity } from '../../common/base-entity'
import { UserEntity } from './user.entity'

@Entity('companyusers')
export class CompanyUserEntity extends BaseEntity {
    @Column({
        type: 'varchar'
    })
    street: string

    @Column({
        type: 'varchar'
    })
    cep: string

    @Column({
        type: 'int'
    })
    number: number

    @Column({
        type: 'varchar'
    })
    cnpj: string

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
