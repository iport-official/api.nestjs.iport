import { UserEntity } from "src/typeorm/entities/user.entity"

export class RegisterProxy {

    id: string
    email: string
    username: string
    createAt: Date
    updateAt: Date
    profileImage: string

    constructor(entity: UserEntity) {
        this.id = entity.id
        this.email = entity.email
        this.username = entity.username
        this.createAt = entity.createAt
        this.updateAt = entity.updateAt
        this.profileImage = entity.profileImage
    }

}
