import {
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { PostEntity } from 'src/typeorm/entities/post.entity'

import { ArrayProxy } from 'src/common/array-proxy'

const contentInPage = 5

@Injectable()
export class PostService extends TypeOrmCrudService<PostEntity> {
    public constructor(
        @InjectRepository(PostEntity)
        private readonly repository: Repository<PostEntity>
    ) {
        super(repository)
    }

    /**
     * Method that can return an unique post
     * @param id indicates which post the users wants to get
     */
    public async getUniquePost(id: string): Promise<PostEntity> {
        const post = await this.repository
            .createQueryBuilder('posts')
            .where({ id })
            .leftJoinAndSelect('posts.user', 'users')
            .innerJoinAndSelect('users.companyUser', 'companyusers.user')
            .leftJoinAndSelect('users.telephones', 'telephones.user')
            .leftJoinAndSelect('users.emails', 'emails.user')
            .getOne()
        if (!post) throw new NotFoundException('Post not found')
        return post
    }

    /**
     * Method that returns the most recommended posts in the app
     * @param page indicates which page the user want to laod
     */
    public async getHighlights(page: number): Promise<ArrayProxy<PostEntity>> {
        try {
            const queryBuilder = this.repository
                .createQueryBuilder('posts')
                .orderBy('posts.recommendations', 'DESC')

            const length = await queryBuilder.getCount()

            const array = await queryBuilder
                .offset(page * contentInPage)
                .leftJoinAndSelect('posts.user', 'users')
                .innerJoinAndSelect('users.companyUser', 'companyusers.user')
                .leftJoinAndSelect('users.telephones', 'telephones.user')
                .leftJoinAndSelect('users.emails', 'emails.user')
                .limit(page * contentInPage + contentInPage)
                .getMany()

            return {
                length,
                array
            }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    /**
     * Method that can get the recomendations for each user, based on the category
     * @param category inidicates which category the user want
     * @param page indicates which page the user want to get
     */
    public async getByCategory(
        category: string,
        page: number
    ): Promise<ArrayProxy<PostEntity>> {
        try {
            const queryBuilder = this.repository
                .createQueryBuilder('posts')
                .where({ category })
                .orderBy('posts.recommendations', 'DESC')

            const length = await queryBuilder.getCount()

            const array = await queryBuilder
                .offset(page * contentInPage)
                .leftJoinAndSelect('posts.user', 'users')
                .innerJoinAndSelect('users.companyUser', 'companyusers.user')
                .leftJoinAndSelect('users.telephones', 'telephones.user')
                .leftJoinAndSelect('users.emails', 'emails.user')
                .limit(page * contentInPage + contentInPage)
                .getMany()

            return {
                length,
                array
            }
        } catch (error) {
            throw new NotFoundException(error)
        }
    }

    /**
     * Method that can get the main post
     */
    public async getMainPost(): Promise<PostEntity> {
        const main = await this.repository
            .createQueryBuilder('posts')
            .addSelect(
                'MAX(posts.recommendations * 0.7 * posts.likes * 0.3)',
                'MAX'
            )
            .innerJoinAndSelect('posts.user', 'users')
            .innerJoinAndSelect('users.companyUser', 'companyusers.user')
            .getOne()
        if (!main) throw new NotFoundException('Post not found')
        return main
    }
}
