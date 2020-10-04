import { Injectable } from '@nestjs/common'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PersonalUserEntity } from '../../../typeorm/entities/personal-user.entity'
import { RegisterPersonalUserPayload } from '../models/register-personal-user.payload'
import { RegisterPersonalUserProxy } from '../models/register-personal-user.proxy'

@Injectable()
export class PersonalUserService extends TypeOrmCrudService<PersonalUserEntity> {

    public constructor(
        @InjectRepository(PersonalUserEntity)
        private readonly repository: Repository<PersonalUserEntity>,
    ) { super(repository) }

    public async registerPersonalAccount(
        registerPersonalAccountPayload: RegisterPersonalUserPayload
    ): Promise<RegisterPersonalUserProxy> {
        const personalUser = await this.repository.save(registerPersonalAccountPayload)
        return new RegisterPersonalUserProxy(personalUser)
    }

    public async getPersonalAccount(id: string): Promise<RegisterPersonalUserProxy> {
        const personalUsers = await this.repository.find({ where: { id }})
        return new RegisterPersonalUserProxy(personalUsers[0])
    }

}
