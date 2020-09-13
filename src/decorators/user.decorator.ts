import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const RequestUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const http = context.switchToHttp()
    const request = http.getRequest()

    return request.user
})
