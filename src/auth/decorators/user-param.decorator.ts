import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { USER_KEY } from '../../../shared/const';

export const UserParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(request[USER_KEY])
    return request[USER_KEY];
  },
);
