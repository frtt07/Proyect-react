import { User } from './User';
import { Role } from './Role';

export interface UserRole {
  id?: number;
  userId: number;
  roleId: number;
  startAt?: string;
  endAt?: string;
  user?: User;
  role?: Role;
}
