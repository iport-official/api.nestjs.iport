import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { CategoryEntity } from 'src/typeorm/entities/category.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CategoryEntity])
    ],
    providers: [CategoryService],
    controllers: [CategoryController]
})
export class CategoryModule { }
