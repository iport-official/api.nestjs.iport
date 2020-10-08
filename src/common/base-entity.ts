import { CrudValidationGroups } from '@nestjsx/crud'
import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'

import { IsOptional } from 'class-validator'

const { CREATE, UPDATE } = CrudValidationGroups

export class BaseEntity {
    @IsOptional({ groups: [CREATE, UPDATE] })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @IsOptional({ groups: [CREATE, UPDATE] })
    @CreateDateColumn()
    createAt: Date

    @IsOptional({ groups: [CREATE, UPDATE] })
    @UpdateDateColumn()
    updateAt: Date
}
