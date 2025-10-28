import { User } from "./User.ts";

export interface session {
    id?: number;
    token?: string;
    createdAt?: Date;
    updatedAt?: Date;
    user?: User;
}