// import { applyDecorators, UseGuards } from "@nestjs/common";
// import { AuthGuard } from "@nestjs/passport";
// import { JwtAuthGuard } from "src/guards/jwt/jwt-auth.guard";
// import { NestCustomDecorator } from "src/utils/apply-decorator";
// import { Roles } from "../roles/roles.decorator";

// export function ProtectTo(...roles: string): NestCustomDecorator {
//     return applyDecorators(
//         Roles(...roles),
//         UseGuards(AuthGuard(JwtAuthGuard), RolesGua)
//     )
// }
