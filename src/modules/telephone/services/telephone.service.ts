import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";

import { TelephoneEntity } from "src/typeorm/entities/telephone.entity";
import { BaseArrayProxy } from "src/common/base-array-proxy";
import { TelephoneProxy } from "../models/telephone.proxy";
import { TelephonePayload } from "../models/telephone.payload";

import { UserService } from "src/modules/user/services/user.service";
import { UserProxy } from "src/modules/user/models/user.proxy";

@Injectable()
export class TelephoneService extends TypeOrmCrudService<TelephoneEntity> {

    constructor(
        @InjectRepository(TelephoneEntity)
        private readonly repository: Repository<TelephoneEntity>,
        private readonly userService: UserService
    ) { super(repository) }

    /**
     * Method that allows creating telephones and the associating them to users
     * @param telephonePayload indicates the array of telephones and the user id
     */
    async registerTelephones(telephonePayload: TelephonePayload): Promise<BaseArrayProxy<TelephoneProxy>> {
        try {
            const user = await this.userService.findOne({ where: { id: telephonePayload.userId } })
            const array = await this.repository.save(telephonePayload.telephones.map(telephone => {
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

}
