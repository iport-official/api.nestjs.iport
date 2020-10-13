import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { TelephoneEntity } from 'src/typeorm/entities/telephone.entity'

import { UserService } from 'src/modules/user/services/user.service'

@Injectable()
export class TelephoneService extends TypeOrmCrudService<TelephoneEntity> {
    public constructor(
        @InjectRepository(TelephoneEntity)
        private readonly repository: Repository<TelephoneEntity>,
        private readonly userService: UserService
    ) {
        super(repository)
    }

    /**
     * Method that allows creating telephones and the associating them to users
     * @param telephones stores an array with all the user telephones
     * @param userId stores the user id
     */
    public async registerTelephones(
        telephones: string[],
        userId: string
    ): Promise<TelephoneEntity[]> {
        const user = await this.userService.getUserById(userId)
        if (!user) throw new NotFoundException('User not found')
        return await this.repository.save(
            telephones.map(telephone => {
                return {
                    telephone,
                    user
                }
            })
        )
    }

    /**
     * Method that can update all the user's telephones
     * @param telephones stores an array of strings representing the telephones
     * @param userId stores the user id
     */
    public async updateTelephones(
        telephones: string[],
        userId: string
    ): Promise<TelephoneEntity[]> {
        const user = await this.userService.getUserById(userId)
        if (!user) throw new NotFoundException('User not found')
        await this.repository.delete({ user })
        return await this.repository.save(
            telephones.map(telephone => {
                return {
                    telephone,
                    user
                }
            })
        )
    }

    /**
     * Method that can get the user's telephones array
     * @param userId stores the user id
     */
    public async getTelephonesFromUser(
        userId: string
    ): Promise<TelephoneEntity[]> {
        const user = await this.userService.getUserById(userId)
        if (!user) throw new NotFoundException('User not found')
        const telephones = await this.repository.find({ user })
        if (!telephones) throw new NotFoundException('Telephones not found')
        return telephones
    }
}
