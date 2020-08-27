import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity('users')
export default class User {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        length: 100,
        unique: true
    })
    username: string

    @Column({
        length: 100,
        unique: true
    })
    name: string

    @Column({
        length: 100,
        unique: true
    })
    password: string

    @CreateDateColumn()
    createAt: Date

    @UpdateDateColumn()
    updateAt: Date
}
