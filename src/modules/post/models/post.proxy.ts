import { PostEntity } from 'src/typeorm/entities/post.entity'

import { UserProxy } from 'src/modules/user/models/user.proxy'

export class PostProxy {
    id: string
    image: string
    title: string
    description: string
    category: string
    contact: string
    recommendations: number
    likes: number
    salary: number
    role: string
    local: string
    requirements: string
    experienceLevel: string
    jobDescription: string
    createAt: Date
    updateAt: Date
    user: UserProxy

    public constructor(entity: PostEntity) {
        this.id = entity.id
        this.title = entity.title
        this.description = entity.description
        this.category = entity.category
        this.contact = entity.contact
        this.recommendations = entity.recommendations
        this.likes = entity.likes
        this.salary = entity.salary
        this.role = entity.role
        this.local = entity.local
        this.requirements = entity.requirements
        this.experienceLevel = entity.experienceLevel
        this.jobDescription = entity.jobDescription
        this.createAt = entity.createAt
        this.updateAt = entity.updateAt
        this.image = entity.image
        this.user = new UserProxy(entity.user)
    }
}
