import { SetMetadata } from '@nestjs/common';
import { Role } from '../entities/user.entity';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: Role[]) => {
  return SetMetadata(META_ROLES, args);
};
