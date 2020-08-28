import { IsOptional } from 'class-validator';

import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { CrudValidationGroups } from '@nestjsx/crud';
const { CREATE, UPDATE } = CrudValidationGroups;

export class BaseEntity {

    @IsOptional({ groups: [CREATE, UPDATE]})
    @PrimaryGeneratedColumn('uuid')
    id: number

    @IsOptional({ groups: [CREATE, UPDATE] })
    @CreateDateColumn()
    createAt: Date

    @IsOptional({ groups: [CREATE, UPDATE] })
    @UpdateDateColumn()
    updateAt: Date

    @IsOptional({ groups: [CREATE, UPDATE] })
    @Column({ default: true })
    isActive: boolean
}
