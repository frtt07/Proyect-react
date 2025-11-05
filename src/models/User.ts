import { Address } from "./Address";
import { Profile } from "./Profile";

export interface User {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    age?: number;
    phone?: string;
    city?: string;
    is_active?: boolean;
    token?: string;
    address?: Address;
    profile?: Profile;
    picture?: string;
}