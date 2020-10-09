import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Repository } from "typeorm";

import { CompetenceEntity } from "src/typeorm/entities/competence.entity";

import { UserService } from "src/modules/user/services/user.service";

@Injectable()
export class CompetenceService extends TypeOrmCrudService<CompetenceEntity> {
    public constructor(
        @InjectRepository(CompetenceEntity)
        private readonly repository: Repository<CompetenceEntity>,
        private readonly userService: UserService
    ) {
        super(repository)
    }
}
