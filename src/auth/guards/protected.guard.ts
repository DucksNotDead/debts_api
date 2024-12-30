import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { AUTH_TOKEN_KEY, IS_PUBLIC_KEY, USER_KEY } from '../../../shared/const';
import { UsersService } from '../../users/users.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ProtectedGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req: Request = context.switchToHttp().getRequest();

    const userId = this.authService.userIdFromToken(
      req.cookies[AUTH_TOKEN_KEY],
    );
    if (!userId) {
      return false;
    }

    return new Promise((resolve) => {
      this.usersService
        .getById(userId)
        .then((user) => {
          req[USER_KEY] = user;
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }
}
