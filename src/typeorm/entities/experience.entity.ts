import { Entity } from 'typeorm'

import { BaseEntity } from 'src/common/base-entity'

@Entity('experiences')
export class ExperienceEntity extends BaseEntity {}
