import { SetMetadata } from '@nestjs/common';
import { ADMIN_ROLE } from '../types/admin-auth.types';

export const AdminRoles = (...roles: ADMIN_ROLE[]) =>
  SetMetadata('admin_roles', roles);
