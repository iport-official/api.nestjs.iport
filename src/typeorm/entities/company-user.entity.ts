import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/base-entity';

@Entity('companyUsers')
export class CompanyUserEntity extends BaseEntity {

    @Column({
        type: 'varchar'
    })
    street: string

    @Column({
        type: 'varchar'
    })
    cep: string

    @Column({
        type: 'int'
    })
    number: number

    @Column({
        type: 'varchar'
    })
    cnpj: string

}
