import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { EmailEntity } from 'src/typeorm/entities/email.entity'

import { EmailController } from './controllers/email.controller'

import { EmailService } from './services/email.service'

import { UserModule } from '../user/user.module'

@Module({
    imports: [
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([EmailEntity])
    ],
    providers: [EmailService],
    controllers: [EmailController],
    exports: [EmailService]
})
export class EmailModule {}
