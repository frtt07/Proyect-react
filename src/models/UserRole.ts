import { User } from './User';
import { Role } from './Role';

export interface UserRole {
  id?: string;
  userId: number;
  roleId: number;
  startAt?: string;
  endAt?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: User;
  role?: Role;
}