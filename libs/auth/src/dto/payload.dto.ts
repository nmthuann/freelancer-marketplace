import { Role } from 'y/user/enums/role.enum';

export type PayloadDto = {
  email: string;
  role: Role;
};
