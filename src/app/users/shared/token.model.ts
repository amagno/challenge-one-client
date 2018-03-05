import { User } from './user.model';
export class Token {
  token: string;
  user: User;
  at: Date;
}

