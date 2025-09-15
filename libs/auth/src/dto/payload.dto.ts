import { Role } from 'libs/user/enums/role.enum';

export type PayloadDto = {
  email: string;
  role: Role;
};
