import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CompetenceEntity } from "src/typeorm/entities/competence.entity";

import { CompetenceController } from "./controllers/competence.controller";

import { CompetenceService } from "./services/competence.service";

import { UserModule } from "../user/user.module";

@Module({
    imports: [UserModule, TypeOrmModule.forFeature([CompetenceEntity])],
    controllers: [CompetenceController],
    providers: [CompetenceService],
    exports: [CompetenceService]
})
export class CompetenceModule {}
