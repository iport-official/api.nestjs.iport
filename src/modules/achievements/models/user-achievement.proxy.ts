import { AchievementEntity } from 'src/typeorm/entities/achievement.entity'

import { AchievementProxy } from './achievement.proxy'
import { UserProxy } from 'src/modules/user/models/user.proxy'

export class UserAchievementProxy extends AchievementProxy {
    user: UserProxy

    public constructor(entity: AchievementEntity) {
        super(entity)
        this.user = new UserProxy(entity.user)
    }
}
