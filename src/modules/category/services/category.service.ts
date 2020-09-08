import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { BaseArrayProxy } from 'src/common/base-array-proxy';

import { CategoryPayload } from '../models/category.payload';
import { CategoryProxy } from '../models/category.proxy';

import { CategoryEntity } from 'src/typeorm/entities/category.entity';


@Injectable()
export class CategoryService extends TypeOrmCrudService<CategoryEntity>{

    constructor(
        @InjectRepository(CategoryEntity)
        private readonly repository: Repository<CategoryEntity>
    ) { super(repository) }

    async create(categoryPayload: CategoryPayload): Promise<CategoryProxy> {
        try {
            return await this.repository.save({ ...categoryPayload })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getUniqueCategory(id: string): Promise<CategoryProxy> {
        try {
            return await this.repository.findOne({ where: { id } })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getCategories(page: number): Promise<BaseArrayProxy<CategoryProxy>> {
        try {
            const [array, length] = await this.repository
                .createQueryBuilder('categories')
                .getManyAndCount()

            return { length, array }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

}
