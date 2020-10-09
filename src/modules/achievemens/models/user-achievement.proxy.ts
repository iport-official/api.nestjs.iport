import { AchievementEntity } from 'src/typeorm/entities/achievement.entity'

import { AchievementProxy } from './achievement.proxy'
import { BasicUserProxy } from 'src/modules/user/models/simple-user.proxy'

export class UserAchievementProxy extends AchievementProxy {
    user: BasicUserProxy

    public constructor(entity: AchievementEntity) {
        super(entity)
        this.user = entity.user
    }
}
