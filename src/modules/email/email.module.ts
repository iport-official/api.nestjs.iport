import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailEntity } from "src/typeorm/entities/email.entity";
import { UserModule } from "../user/user.module";
import { EmailService } from "./services/email.service";
import { EmailController } from "./controllers/email.controller";

@Module({
    imports: [
        forwardRef(()=> UserModule),
        TypeOrmModule.forFeature([EmailEntity])
    ],
    providers: [EmailService],
    controllers: [EmailController],
    exports: [EmailService]
})
export class EmailModule { }
