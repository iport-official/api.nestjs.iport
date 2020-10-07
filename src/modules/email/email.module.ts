import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { EmailEntity } from 'src/typeorm/entities/email.entity'
import { EmailService } from './services/email.service'

@Module({
    imports: [TypeOrmModule.forFeature([EmailEntity])],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule {}
