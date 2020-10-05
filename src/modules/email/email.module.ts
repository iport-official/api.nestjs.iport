import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { EmailEntity } from 'src/typeorm/entities/email.entity'
import { EmailService } from './services/email.service'
import { EmailController } from './controllers/email.controller'

@Module({
    imports: [TypeOrmModule.forFeature([EmailEntity])],
    providers: [EmailService],
    controllers: [EmailController],
    exports: [EmailService]
})
export class EmailModule {}
