import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TelephoneEntity } from 'src/typeorm/entities/telephone.entity'

import { TelephoneController } from './controllers/telephone.controller'

import { TelephoneService } from './services/telephone.service'

import { UserModule } from '../user/user.module'

@Module({
    imports: [
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([TelephoneEntity])
    ],
    providers: [TelephoneService],
    controllers: [TelephoneController],
    exports: [TelephoneService]
})
export class TelephoneModule {}
