import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'

import { BaseEntity } from '../../common/base-entity'
import { UserEntity } from './user.entity'

import { IsOptional } from 'class-validator'

@Entity('personalusers')
export class PersonalUserEntity extends BaseEntity {
    @Column({
        type: 'varchar',
        length: 11
    })
    cpf: string

    @Column({
        type: 'varchar',
        length: 100,
        nullable: true
    })
    @IsOptional()
    status?: string

    @Column({
        type: 'varchar',
        length: 75,
        nullable: true
    })
    @IsOptional()
    job?: string

    @Column({
        type: 'varchar',
        length: 200,
        nullable: true
    })
    @IsOptional()
    highlights?: string

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
