import { Injectable } from '@nestjs/common'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { CompanyUserEntity } from '../../../typeorm/entities/company-user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RegisterCompanyUserPayload } from '../models/register-company-user.payload';
import { RegisterCompanyUserProxy } from '../models/register-company-user-proxy';

@Injectable()
export class CompanyUserService extends TypeOrmCrudService<CompanyUserEntity> {

    public constructor(
        @InjectRepository(CompanyUserEntity)
        private readonly repository: Repository<CompanyUserEntity>
    ) { super(repository) }

    public async registerCompanyAccount(
        registerCompanyAccountPayload: RegisterCompanyUserPayload
    ): Promise<RegisterCompanyUserProxy> {
        const companyUser = await this.repository.save(registerCompanyAccountPayload)
        return new RegisterCompanyUserProxy(companyUser)
    }

    public async getCompanyAccount(id: string) {
        const companyUsers = await this.repository.find({where:{id}})
        return new RegisterCompanyUserProxy((companyUsers[0]))
    }

}
