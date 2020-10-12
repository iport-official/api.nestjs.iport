import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { CategoryEntity } from 'src/typeorm/entities/category.entity'

import { CategoryPayload } from '../models/category.payload'
import { CategoryProxy } from '../models/category.proxy'
import { ArrayProxy } from 'src/common/array-proxy'

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
            throw new InternalServerErrorException(error)
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
            throw new NotFoundException(error)
        }
    }

    /**
     * Method that return all categories, divide them in pages
     * @param page indicates which page must be loaded
     */
    public async getCategories(
        page: number
    ): Promise<ArrayProxy<CategoryProxy>> {
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
            throw new InternalServerErrorException(error)
        }
    }
}
