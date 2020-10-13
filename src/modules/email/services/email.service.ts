import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'

import { EmailEntity } from 'src/typeorm/entities/email.entity'

import { UserService } from 'src/modules/user/services/user.service'

@Injectable()
export class EmailService extends TypeOrmCrudService<EmailEntity> {
    public constructor(
        @InjectRepository(EmailEntity)
        private readonly repository: Repository<EmailEntity>,
        private readonly userService: UserService
    ) {
        super(repository)
    }

    /**
     * Method that allow creating emails and the associating them to users
     * @param emails stores an array with all the user emails
     * @param userId stores the user id
     */
    public async registerEmails(
        emails: string[],
        userId: string
    ): Promise<EmailEntity[]> {
        const user = await this.userService.getUserById(userId)
        if (!user) throw new NotFoundException('User not found')
        return await this.repository.save(
            emails.map(email => {
                return {
                    email,
                    user
                }
            })
        )
    }

    /**
     * Method that can update all the user's emails
     * @param emails stores an array of strings representing the emails
     * @param userId stores the user id
     */
    public async updateEmails(
        emails: string[],
        userId: string
    ): Promise<EmailEntity[]> {
        const user = await this.userService.getUserById(userId)
        if (!user) throw new NotFoundException('User not found')
        await this.repository.delete({ user })
        return await this.repository.save(
            emails.map(email => {
                return {
                    email,
                    user
                }
            })
        )
    }

    /**
     * Method that can get the user's emails array
     * @param userId stores the user id
     */
    public async getEmailsFromUser(userId: string): Promise<EmailEntity[]> {
        const user = await this.userService.getUserById(userId)
        if (!user) throw new NotFoundException('User not found')
        const emails = await this.repository.find({ user })
        if (!emails) throw new NotFoundException('Emails not found')
        return emails
    }
}
