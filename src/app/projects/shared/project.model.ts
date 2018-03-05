import { ApiModel } from '../../shared/api.model';
import { User } from '../../users/shared/user.model';

export interface Menber extends User {
  workloadAvailable?: number;
  workloadProject?: number;
}
export interface Project extends ApiModel {
  name?: string;
  boss?: User;
  description?: string;
  start?: Date;
  finish?: Date;
  team?: Menber[];
}
