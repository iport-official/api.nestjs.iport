import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { RequestUserProperties } from 'src/common/jwt-validation-properties';

@Injectable()
export class RolesGuard implements CanActivate {
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = new Reflector().get<string[]>('roles', context.getHandler())

        if (!roles) return true

        const request = context.switchToHttp().getRequest()
        const user: RequestUserProperties = request.user

        if (!user)
            throw new UnauthorizedException(
                'You have no permission to access those sources'
            )

        if (user && user.accountType && roles.includes(user.accountType)) return true

        throw new UnauthorizedException(
            'You have no permission to access those sources'
        )
    }
}
