import { Entity, Column } from "typeorm";
import { BaseEntity } from "src/common/base-entity";

@Entity('categories')
export class CategoryEntity extends BaseEntity {

    @Column({
        type: 'varchar'
    })
    name: string

    @Column({
        type: 'varchar'
    })
    category: string

}
