import { Injectable } from '@nestjs/common'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository, UpdateResult } from 'typeorm'
import { PersonalUserEntity } from '../../../typeorm/entities/personal-user.entity'
import { RegisterPersonalUserPayload } from '../models/register-personal-user.payload'

@Injectable()
export class PersonalUserService extends TypeOrmCrudService<
    PersonalUserEntity
> {
    public constructor(
        @InjectRepository(PersonalUserEntity)
        private readonly repository: Repository<PersonalUserEntity>
    ) {
        super(repository)
    }

    public async registerPersonalAccount(
        registerPersonalAccountPayload: RegisterPersonalUserPayload
    ): Promise<PersonalUserEntity> {
        return await this.repository.save(registerPersonalAccountPayload)
    }

    public async updatePersonalUser(
        id: string,
        payload: DeepPartial<PersonalUserEntity>
    ): Promise<UpdateResult> {
        return await this.repository.update({ id }, payload)
    }

    public async getPersonalAccount(id: string): Promise<PersonalUserEntity> {
        return await this.repository.findOne({ where: { id } })
    }
}
