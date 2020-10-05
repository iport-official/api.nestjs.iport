import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const RequestUser = createParamDecorator<unknown, ExecutionContext>(
    (data, context) => {
        const http = context.switchToHttp()
        const request = http.getRequest()

        return request.user
    }
)
