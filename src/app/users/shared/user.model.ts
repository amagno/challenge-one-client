import { ApiModel } from '../../shared/api.model';

export interface User extends ApiModel {
  // username: string;
  name?: string;
  email?: string;
  birth?: Date;
  workload?: number;
  schooling?: string;
  phone?: string;
}
