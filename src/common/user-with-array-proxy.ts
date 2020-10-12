import { ArrayProxy } from './array-proxy'

export class UserWithArrayProxy<TUser, TValue> {
    user: TUser
    arrayProxy: ArrayProxy<TValue>
}
