import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TelephoneEntity } from 'src/typeorm/entities/telephone.entity'

import { TelephoneService } from './services/telephone.service'

@Module({
    imports: [TypeOrmModule.forFeature([TelephoneEntity])],
    providers: [TelephoneService],
    exports: [TelephoneService]
})
export class TelephoneModule {}
