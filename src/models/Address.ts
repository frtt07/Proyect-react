import { User } from "./User";

export interface Address {
  id?: number;
  street: string;
  number: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  userId?: number;
  user?: User;
}