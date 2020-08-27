import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { Crud, CrudController, CrudService} from "@nestjsx/crud";
import User from 'src/typeorm/entities/user.entity';

@Crud({
    model: {
        type: User
    }
})
@Controller('users')
export class UserController implements CrudController<User> {

    service: CrudService<User>;

    constructor(private userService: UserService) { }

    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        this.userService.createUser(createUserDto)
    }
}
