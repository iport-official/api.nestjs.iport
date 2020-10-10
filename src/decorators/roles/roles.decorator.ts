import { SetMetadata } from "@nestjs/common";

export const Roles: unknown = (...roles: string[]) => SetMetadata('roles', roles)
