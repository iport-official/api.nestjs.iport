import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TelephoneEntity } from "src/typeorm/entities/telephone.entity";

import { TelephoneService } from "./services/telephone.service";
import { TelephoneController } from "./controllers/telephone.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([TelephoneEntity])
    ],
    providers: [TelephoneService],
    controllers: [TelephoneController],
    exports: [TelephoneService]
})
export class TelephoneModule { }
