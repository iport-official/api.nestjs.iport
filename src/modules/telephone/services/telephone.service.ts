import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";

import { TelephoneEntity } from "src/typeorm/entities/telephone.entity";
import { BaseArrayProxy } from "src/common/base-array-proxy";
import { TelephoneProxy } from "../models/telephone.proxy";

import { UserProxy } from "src/modules/user/models/user.proxy";
import { UserEntity } from "src/typeorm/entities/user.entity";

@Injectable()
export class TelephoneService extends TypeOrmCrudService<TelephoneEntity> {

    public constructor(
        @InjectRepository(TelephoneEntity)
        private readonly repository: Repository<TelephoneEntity>,
    ) { super(repository) }

    /**
     * Method that allows creating telephones and the associating them to users
     * @param telephonePayload indicates the array of telephones and the user id
     */
    public async registerTelephones(telephones: string[], user: UserEntity): Promise<BaseArrayProxy<TelephoneProxy>> {
        try {
            const array = await this.repository.save(telephones.map(telephone => {
                return {
                    telephone,
                    user: new UserProxy(user)
                }
            }))
            return {
                length: array.length,
                array: array.map(element => new TelephoneProxy(element))
            }
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async deleteTelephone(id: string): Promise<void> {
        try {
            await this.repository.delete({ id })
        } catch (error) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
    }

    public async deleteAllTelephonesByUser(user: UserEntity): Promise<void> {
        try {
            await this.repository.delete({ user })
        } catch (error) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
    }

}
