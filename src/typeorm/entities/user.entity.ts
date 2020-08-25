import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../../common/base-entity'

@Entity('user')
export class UserEntity extends BaseEntity {
    @Column({ nullable: false, unique: true })
    public username: string

    @Column({ nullable: false })
    public name: string

    @Column({ nullable: false })
    public password: string

    constructor(partial: Partial<UserEntity>) {
        super()
        Object.assign(this, partial)
    }
}
