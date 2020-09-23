import { Repository } from "typeorm";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
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

    public constructor(
        @InjectRepository(EmailEntity)
        private readonly repository: Repository<EmailEntity>,
        @Inject('UserService')
        private readonly userService: UserService
    ) { super(repository) }

    /**
     * Method that allows creating email and the associating them to users
     * @param emailPayload indicates the array of emails and the user id
     */
    public async registerEmails(emailPayload: EmailPayload): Promise<BaseArrayProxy<EmailProxy>> {
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
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async deleteEmail(id: string): Promise<void> {
        try {
            await this.repository.delete({ id })
        } catch (error) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
    }

    public async deleteAllEmailsUsingUserID(userId: string): Promise<void> {
        try {
            const user = await this.userService.findOne({ where: { id: userId } })
            await this.repository.delete({ user })
        } catch (error) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
    }

}
