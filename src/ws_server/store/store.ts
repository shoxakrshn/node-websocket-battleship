import WebSocket from 'ws';
import { Game } from '../model/Game.model';
import { Room } from '../model/Room.model';
import { User } from '../model/User.model';

type SocketsStoreType = {
  [x: string]: WebSocket;
};

type store = {
  userDb: Map<number, User>;
  roomDb: Map<number, Room>;
  gameDb: Map<number, Game>;
  socketDb: SocketsStoreType;
};

export const { userDb, roomDb, gameDb, socketDb }: store = {
  userDb: new Map<number, User>(),
  roomDb: new Map<number, Room>(),
  gameDb: new Map<number, Game>(),
  socketDb: {},
};
