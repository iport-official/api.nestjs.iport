import { PostEntity } from 'src/typeorm/entities/post.entity'

export class PostProxy {
    id: string
    image: string
    title: string
    description: string
    category: string
    recommendations: number
    likes: number
    salary: number
    post: string
    local: string
    requirements: string
    experienceLevel: string
    vacancyDescription: string
    createAt: Date
    updateAt: Date

    public constructor(entity: PostEntity) {
        this.id = entity.id
        this.title = entity.title
        this.description = entity.description
        this.category = entity.category
        this.recommendations = entity.recommendations
        this.likes = entity.likes
        this.salary = entity.salary
        this.post = entity.post
        this.local = entity.local
        this.requirements = entity.requirements
        this.experienceLevel = entity.experienceLevel
        this.vacancyDescription = entity.vacancyDescription
        this.createAt = entity.createAt
        this.updateAt = entity.updateAt
        this.image = entity.image
    }
}
