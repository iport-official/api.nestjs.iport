import { Repository } from "typeorm";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";

import { EmailEntity } from "src/typeorm/entities/email.entity";
import { BaseArrayProxy } from "src/common/base-array-proxy";
import { EmailPayload } from "../models/email.payload";
import { EmailProxy } from "../models/email.proxy";

import { UserService } from "src/modules/user/services/user.service";
import { UserProxy } from "src/modules/user/models/user.proxy";

@Injectable()
export class EmailService extends TypeOrmCrudService<EmailEntity> {

    constructor(
        @InjectRepository(EmailEntity)
        private readonly repository: Repository<EmailEntity>,
        private readonly userService: UserService
    ) { super(repository) }

    /**
     * Method that allows creating email and the associating them to users
     * @param emailPayload indicates the array of emails and the user id
     */
    async registerEmails(emailPayload: EmailPayload): Promise<BaseArrayProxy<EmailProxy>> {
        try {
            const user = await this.userService.findOne({ where: { id: emailPayload.userId } })
            const array = await this.repository.save(emailPayload.emails.map(email => {
                return {
                    email,
                    user: new UserProxy(user)
                }
            }))
            return {
                length: array.length,
                array: array.map(element => new EmailProxy(element))
            }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

}
