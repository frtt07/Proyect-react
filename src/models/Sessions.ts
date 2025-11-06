import { User } from "./User";

export interface Session {
  id: string | null;
  token: string;
  expiration: string;
  FACode: string;
  state: string;
  user: User; // o pon el tipo real si tienes la clase User
}
