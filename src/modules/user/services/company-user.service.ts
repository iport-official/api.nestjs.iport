import { Injectable } from '@nestjs/common'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { CompanyUserEntity } from '../../../typeorm/entities/company-user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RegisterCompanyUserPayload } from '../models/register-company-user.payload';

@Injectable()
export class CompanyUserService extends TypeOrmCrudService<CompanyUserEntity> {

    public constructor(
        @InjectRepository(CompanyUserEntity)
        private readonly repository: Repository<CompanyUserEntity>
    ) { super(repository) }

    public async registerCompanyAccount(
        registerCompanyAccountPayload: RegisterCompanyUserPayload
    ): Promise<CompanyUserEntity> {
        return await this.repository.save(registerCompanyAccountPayload)
    }

    public async getCompanyAccount(id: string): Promise<CompanyUserEntity> {
        return await this.repository.findOne({where:{id}})
    }

}
