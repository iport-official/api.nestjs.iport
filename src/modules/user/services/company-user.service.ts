import {
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { DeepPartial, Repository, UpdateResult } from 'typeorm'

import { CompanyUserEntity } from '../../../typeorm/entities/company-user.entity'

import { RegisterCompanyUserPayload } from '../models/register-company-user.payload'

@Injectable()
export class CompanyUserService extends TypeOrmCrudService<CompanyUserEntity> {
    public constructor(
        @InjectRepository(CompanyUserEntity)
        private readonly repository: Repository<CompanyUserEntity>
    ) {
        super(repository)
    }

    /**
     * Method that can register some company account data in database
     * @param registerCompanyAccountPayload stores the requestd ata
     */
    public async createCompanyAccount(
        registerCompanyAccountPayload: RegisterCompanyUserPayload
    ): Promise<CompanyUserEntity> {
        try {
            return await this.repository.save(registerCompanyAccountPayload)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    /**
     * Method that can update some company user entity in the database
     * @param id stores the project id that will be searched
     * @param payload stores the new data, that will be updated
     */
    public async updateCompanyUser(
        id: string,
        payload: DeepPartial<CompanyUserEntity>
    ): Promise<UpdateResult> {
        try {
            return await this.repository.update({ id }, payload)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    /**
     * Method that can get a specific account entity
     * @param id stores the project id that will be searched
     */
    public async getCompanyAccount(id: string): Promise<CompanyUserEntity> {
        const company = await this.repository.findOne({ where: { id } })
        if (!company) throw new NotFoundException('Company account not found')
        return company
    }
}
