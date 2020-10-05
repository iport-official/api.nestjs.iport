import { CompanyUserEntity } from '../../../typeorm/entities/company-user.entity'

export class CompanyUserProxy {
    street: string
    number: number
    cep: string
    cnpj: string

    public constructor(entity: CompanyUserEntity) {
        this.street = entity.street
        this.number = entity.number
        this.cnpj = entity.cnpj
        this.cep = entity.cep
    }
}
