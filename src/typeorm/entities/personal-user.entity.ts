import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/base-entity';
import { UserEntity } from './user.entity';

@Entity('personalAccount')
export class PersonalUserEntity extends BaseEntity {

    @Column({
        type: 'varchar'
    })
    cpf: string

    @OneToOne(
        type => UserEntity,
        user => user.personalUser,
        {
            onDelete: 'CASCADE'
        }
    )
    user: UserEntity

}
