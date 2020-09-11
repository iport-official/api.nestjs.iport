import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";

import { EmailEntity } from "src/typeorm/entities/email.entity";
import { BaseArrayProxy } from "src/common/base-array-proxy";
import { EmailPayload } from "../models/email.payload";
import { EmailProxy } from "../models/email.proxy";

import { UserService } from "src/modules/user/services/user.service";

@Injectable()
export class EmailService extends TypeOrmCrudService<EmailEntity> {

    constructor(
        @InjectRepository(EmailEntity)
        private readonly repository: Repository<EmailEntity>,
        private readonly userService: UserService
    ) { super(repository) }

    async registerEmails(emailPayload: EmailPayload): Promise<BaseArrayProxy<EmailProxy>> {
        return null;
    }

}
