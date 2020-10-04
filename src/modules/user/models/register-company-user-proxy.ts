import { CompanyUserEntity } from '../../../typeorm/entities/company-user.entity';

export class RegisterCompanyUserProxy {
    city: string
    street: string
    number: number
    cep: string
    cnpj: string

    public constructor(entity: CompanyUserEntity) {
        this.city = entity.city;
        this.street = entity.street
        this.number = entity.number;
        this.cnpj = entity.cnpj;
    }

}
