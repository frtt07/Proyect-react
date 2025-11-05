import { User } from "./User";

export interface Address {
  id?: number;
  street: string;
  number: string;
  latitude?: number;
  longitude?: number;
  user_id?: number;
  user?: User;
  created_at?: string;
  updated_at?: string;
}