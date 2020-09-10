import { Entity, Column } from "typeorm";
import { BaseEntity } from "src/common/base-entity";

@Entity('categories')
export class CategoryEntity extends BaseEntity {

    @Column({
        type: 'varchar',
        length: 100,
        unique: true,
        nullable: false
    })
    name: string

    @Column({
        type: 'varchar',
        length: 100,
        unique: true,
        nullable: false
    })
    category: string

}
