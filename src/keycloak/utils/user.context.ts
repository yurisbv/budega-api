import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const KeycloakUserContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);


export const KeycloakUserRoleContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.userRole;
  },
);
