import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { TelephoneEntity } from 'src/typeorm/entities/telephone.entity'
import { UserEntity } from 'src/typeorm/entities/user.entity'

@Injectable()
export class TelephoneService extends TypeOrmCrudService<TelephoneEntity> {
    public constructor(
        @InjectRepository(TelephoneEntity)
        private readonly repository: Repository<TelephoneEntity>
    ) {
        super(repository)
    }

    /**
     * Method that allows creating telephones and the associating them to users
     * @param telephones stores an array with all the user telephones
     * @param user stores the user entity
     */
    public async registerTelephones(
        telephones: string[],
        user: UserEntity
    ): Promise<TelephoneEntity[]> {
        try {
            const telephoneEntities = await this.repository.save(
                telephones.map(telephone => {
                    return {
                        telephone,
                        user
                    }
                })
            )
            user.telephones = telephoneEntities
            return telephoneEntities
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    public async getTelephonesFromUser(
        user: UserEntity
    ): Promise<TelephoneEntity[]> {
        try {
            return await this.repository.find({ user })
        } catch (error) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
    }

    /**
     * Method that can delete a specific telephone
     * @param id indicates the unique id that this telephone has
     */
    public async deleteTelephone(id: string): Promise<void> {
        try {
            await this.repository.delete({ id })
        } catch (error) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
    }

    /**
     * Method that can delete all the user's telephones
     * @param user indicates the user that will have all the telephones deleted
     */
    public async deleteAllTelephonesByUser(user: UserEntity): Promise<void> {
        try {
            await this.repository.delete({ user })
        } catch (error) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
    }
}
