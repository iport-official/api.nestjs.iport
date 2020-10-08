import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { EmailEntity } from 'src/typeorm/entities/email.entity'
import { UserEntity } from 'src/typeorm/entities/user.entity'

@Injectable()
export class EmailService extends TypeOrmCrudService<EmailEntity> {
    public constructor(
        @InjectRepository(EmailEntity)
        private readonly repository: Repository<EmailEntity>
    ) {
        super(repository)
    }

    /**
     * Method that allows creating email and the associating them to users
     * @param emailPayload indicates the array of emails and the user id
     */
    public async registerEmails(
        emails: string[],
        user: UserEntity
    ): Promise<EmailEntity[]> {
        try {
            const emailEntities = await this.repository.save(
                emails.map(email => {
                    return {
                        email,
                        user
                    }
                })
            )
            user.emails = emailEntities
            return emailEntities
        } catch (error) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    /**
     * Method that can get the user's emails array
     * @param user stores the entity that will be used to find the user's emails array
     */
    public async getEmailsFromUser(user: UserEntity): Promise<EmailEntity[]> {
        try {
            return await this.repository.find({ user })
        } catch (error) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
    }

    /**
     * Method that can delete a specific email
     * @param id indicates the unique id that this email has
     */
    public async deleteEmail(id: string): Promise<void> {
        try {
            await this.repository.delete({ id })
        } catch (error) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
    }

    /**
     * Method that can delete all the user's emails
     * @param user indicates the user that will have all the emails deleted
     */
    public async deleteAllEmailsUsingByUser(user: UserEntity): Promise<void> {
        try {
            await this.repository.delete({ user })
        } catch (error) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
    }
}
