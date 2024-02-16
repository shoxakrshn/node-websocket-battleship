import { UserDataClientType } from './type';

type UserDbType = {
  [x: string]: UserDataClientType;
};

export const userDb: UserDbType = {};
