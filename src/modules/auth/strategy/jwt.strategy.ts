import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { jwtConstants } from '../constants'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { RequestUserProperties } from 'src/common/jwt-validation-properties'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    public constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret
        })
    }

    /**
     * Method that can validate the user basic properties (id, email, accountType)
     * @param jwtValidationProperties stores the user basic properties
     */
    public async validate(
        jwtValidationProperties: RequestUserProperties
    ): Promise<RequestUserProperties> {
        const { id, email, accountType } = jwtValidationProperties
        return { id, email, accountType }
    }
}
