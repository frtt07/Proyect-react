export interface Password {
  id?: number;
  userId: number;
  passwordHash: string;
  createdAt?: string;
  isActive?: boolean;
  startAt?: string;
  endAt?: string;
  content?: string; 
}