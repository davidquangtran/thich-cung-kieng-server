import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-roles.enum';

export const ROLES_KEY = 'roles';
export const Role = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
