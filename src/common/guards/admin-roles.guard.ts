import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AdminDocument } from 'src/models/admin.schema';
import { ADMIN_ROLE } from '../types/admin-auth.types';

@Injectable()
export class AdminRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const user: AdminDocument = req.admin;

    try {
      const roles = this.reflector.getAllAndOverride<ADMIN_ROLE[]>(
        'admin_roles',
        [context.getHandler(), context.getClass()],
      );

      if (!roles) {
        return true;
      }
      const hasRole = () =>
        user.roles.some((role: ADMIN_ROLE) => roles.includes(role));
      return user && user.roles && hasRole();
    } catch (error) {
      console.error('Error in JwtAuthGuard:', error);
      return false;
    }
  }
}
