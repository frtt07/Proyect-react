import { User } from "./User";
export interface Address {
    id?: number;
    street?: string;
    number?: string;
    latitude?: number;
    longitude?: number;
    user?: User;
}
