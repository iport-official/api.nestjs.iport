import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm'

import { BaseEntity } from 'src/common/base-entity'
import { PostEntity } from './post.entity'
import { TelephoneEntity } from './telephone.entity'
import { EmailEntity } from './email.entity'

import { AccountType } from 'src/models/enums/account.types'
import { PersonalUserEntity } from './personal-user.entity'
import { CompanyUserEntity } from './company-user.entity'

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column({
        type: 'text'
    })
    profileImage: string

    @Column({
        type: 'varchar',
        length: 50,
        unique: true,
        nullable: false
    })
    email: string

    @Column({
        type: 'varchar',
        length: 30,
        unique: true,
        nullable: false
    })
    username: string

    @Column({
        type: 'varchar',
        length: 200,
        nullable: false
    })
    password: string

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false
    })
    city: string

    @Column({
        type: 'varchar',
        length: 2,
        nullable: false
    })
    state: string

    @Column({
        type: 'varchar',
        length: 8,
        nullable: false
    })
    accountType: AccountType

    @OneToOne(type => PersonalUserEntity)
    @JoinColumn()
    personalUser: PersonalUserEntity

    @OneToOne(type => CompanyUserEntity)
    @JoinColumn()
    companyUser: CompanyUserEntity

    @OneToMany(
        type => PostEntity,
        post => post.user
    )
    posts: PostEntity[]

    @OneToMany(
        type => TelephoneEntity,
        telephone => telephone.user
    )
    telephones: TelephoneEntity[]

    @OneToMany(
        type => EmailEntity,
        email => email.user
    )
    emails: EmailEntity[]
}

/*

{
    id: string
    profileImage: string,
    email: string,
    password: string,
    accountType: string,
    username: string,
    city: string,
    state: string,
    content: {
        cnpj: string
        street: string,
        number: number,
    }
}

{
    id: string
    profileImage: string,
    email: string,
    password: string,
    accountType: string,
    username: string,
    city: string,
    state: string,
    content: {
        cpf,
        highlights,
    }
}

*/
