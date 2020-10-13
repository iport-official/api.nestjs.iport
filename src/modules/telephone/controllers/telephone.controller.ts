import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UseGuards
} from '@nestjs/common'

import { ArrayProxy } from 'src/common/array-proxy'

import { TelephoneService } from '../services/telephone.service'

import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard'

@Controller('users/:userId/telephones')
export class TelephoneController {
    public constructor(private readonly telephoneService: TelephoneService) {}

    /**
     * Method that allows creating telephones and the associating them to users
     * @param telephones stores an array with all the user telephones
     * @param userId stores the user id
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    public async registerTelephones(
        @Body() telephones: string[],
        @Param('userId') userId: string
    ): Promise<ArrayProxy<string>> {
        const array = await this.telephoneService.registerTelephones(
            telephones,
            userId
        )
        return {
            length: array.length,
            array: array.map(element => element.telephone)
        }
    }

    /**
     * Method that can update all the user's telephones
     * @param telephones stores an array of strings representing the telephones
     * @param userId stores the user id
     */
    @UseGuards(JwtAuthGuard)
    @Put()
    public async updateTelephones(
        @Body() telephones: string[],
        @Param('userId') userId: string
    ): Promise<ArrayProxy<string>> {
        const array = await this.telephoneService.updateTelephones(
            telephones,
            userId
        )
        return {
            length: array.length,
            array: array.map(element => element.telephone)
        }
    }

    /**
     * Method that can return all the telephones of a user
     * @param userId stores the user id
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    public async getTelephones(
        @Param('userId') userId: string
    ): Promise<ArrayProxy<string>> {
        const array = await this.telephoneService.getTelephonesFromUser(userId)
        return {
            length: array.length,
            array: array.map(element => element.telephone)
        }
    }
}
