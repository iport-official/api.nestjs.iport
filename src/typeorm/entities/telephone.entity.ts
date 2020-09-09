import { Entity, BaseEntity, Column } from "typeorm";

@Entity('telephones')
export class TelephoneEntity extends BaseEntity {

    @Column({
        length: 50
    })
    telephoneNumber: string

}
