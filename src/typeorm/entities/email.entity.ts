import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "src/common/base-entity";
import { UserEntity } from "./user.entity";

@Entity('emails')
export class EmailEntity extends BaseEntity {
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false
    })
    email: string

    @ManyToOne(
        type => UserEntity,
        user => user.emails,
        {
            onDelete: 'CASCADE'
        }
    )
    user: UserEntity
}
