import { User } from '../model/User.model';
import { socketDb, userDb } from '../store/store';
import { RegDataClient, RegDataServer } from '../types/dataTypes';
import { eRequestType } from '../utils/constants';
import { generateResponseDto } from '../utils/generateResponseDto.ts';
import { broadcastRoom } from './updateRoom.controller';
import { broadcastWinners } from './updateWinners.controller';

export const regController = (id: number, data: string) => {
  const { name, password }: RegDataClient = JSON.parse(data);

  const users = Array.from(userDb.values());
  const isUsernameExist = users.some((user) => user.name === name);

  const newUser = new User(id, name, password);
  userDb.set(id, newUser);

  const userData: RegDataServer = {
    name: newUser.name,
    index: newUser.index,
    error: isUsernameExist,
    errorText: isUsernameExist ? 'This usename is already logged in' : '',
  };

  const userDataJson = JSON.stringify(userData);
  const answer = generateResponseDto(eRequestType.Reg, userDataJson);

  socketDb[id].send(answer);
  !isUsernameExist && broadcastRoom();
  !isUsernameExist && broadcastWinners();
};
