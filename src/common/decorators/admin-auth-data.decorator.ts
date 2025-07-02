import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AdminAuthDataParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.admin;
  },
);
