import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { BaseArrayProxy } from 'src/common/base-array-proxy'

import { CategoryPayload } from '../models/category.payload'
import { CategoryProxy } from '../models/category.proxy'

import { CategoryEntity } from 'src/typeorm/entities/category.entity'

const contentInPage = 7

@Injectable()
export class CategoryService extends TypeOrmCrudService<CategoryEntity> {
    public constructor(
        @InjectRepository(CategoryEntity)
        private readonly repository: Repository<CategoryEntity>
    ) {
        super(repository)
    }

    /**
     * Method that can add categories in the database
     * @param categoryPayload The informations about the category
     */
    public async create(
        categoryPayload: CategoryPayload
    ): Promise<CategoryProxy> {
        try {
            return await this.repository.save({ ...categoryPayload })
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    /**
     * Method that can return just one category
     * @param id indicates which category must be returned
     */
    public async getUniqueCategory(id: string): Promise<CategoryProxy> {
        try {
            return await this.repository.findOne({ where: { id } })
        } catch (error) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
    }

    /**
     * Method that return all categories, divide them in pages
     * @param page indicates which page must be loaded
     */
    public async getCategories(
        page: number
    ): Promise<BaseArrayProxy<CategoryProxy>> {
        try {
            const queryBuilder = this.repository.createQueryBuilder(
                'categories'
            )

            const length = await queryBuilder.getCount()

            const array = await queryBuilder
                .offset(page * contentInPage)
                .limit(page * contentInPage + contentInPage)
                .getMany()

            return { length, array }
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}
