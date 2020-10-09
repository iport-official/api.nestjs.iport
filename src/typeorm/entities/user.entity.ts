import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm'

import { AccountType } from 'src/models/enums/account.types'

import { AchievementEntity } from './achievement.entity'
import { CompanyUserEntity } from './company-user.entity'
import { EmailEntity } from './email.entity'
import { ExperienceEntity } from './experience.entity'
import { PersonalUserEntity } from './personal-user.entity'
import { PostEntity } from './post.entity'
import { ProjectEntity } from './project.entity'
import { TelephoneEntity } from './telephone.entity'
import { BaseEntity } from 'src/common/base-entity'

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

    @OneToOne(
        type => PersonalUserEntity,
        personalUserEntity => personalUserEntity.user
    )
    @JoinColumn()
    personalUser: PersonalUserEntity

    @OneToOne(
        type => CompanyUserEntity,
        companyUserEntity => companyUserEntity.user
    )
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

    @OneToMany(
        type => ProjectEntity,
        project => project.user
    )
    projects: ProjectEntity[]

    @OneToMany(
        type => ExperienceEntity,
        experience => experience.user
    )
    experiences: ExperienceEntity[]

    @OneToMany(
        type => AchievementEntity,
        achievement => achievement.user
    )
    achievements: AchievementEntity[]
}
