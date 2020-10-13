import {
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
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

    /**
     * Method that can create a new personal user in the database
     * @param registerPersonalAccountPayload stores the new personal user data
     */
    public async createPersonalAccount(
        registerPersonalAccountPayload: RegisterPersonalUserPayload
    ): Promise<PersonalUserEntity> {
        try {
            return await this.repository.save(registerPersonalAccountPayload)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    /**
     * Method that can update some specif data from a personal user
     * @param id stores the user id
     * @param payload stores the new personal user data
     */
    public async updatePersonalUser(
        id: string,
        payload: DeepPartial<PersonalUserEntity>
    ): Promise<UpdateResult> {
        try {
            return await this.repository.update({ id }, payload)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    /**
     * Method that can get a specific PersonalUserEntity
     * @param id stores the personal user id
     */
    public async getPersonalAccount(id: string): Promise<PersonalUserEntity> {
        const personal = await this.repository.findOne({ where: { id } })
        if (!personal) throw new NotFoundException('Personal account not found')
        return personal
    }
}
