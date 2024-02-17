import { Position, RoomUser, Status } from './types';

export type RegDataClient = {
  name: string;
  password: string;
};

export type RegDataServer = {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
};

export type AddUserToRoomDataClinet = {
  indexRoom: number;
};

export type CreateGameDataServer = {
  idGame: number;
  idPlayer: number;
};

export type AddShipsDataClinet = {
  gameId: number;
  ships: [];
  indexPlayer: number;
};

export type StartGameDataServer = Omit<AddShipsDataClinet, 'indexPlayer'> & {
  currentPlayerIndex: number;
};

export type TurnDataServer = {
  currentPlayer: number;
};

export type AttackDataClient = {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: number;
};

export type AttackDataServer = {
  position: Position;
  currentPlayer: number;
  status: Status;
};

export type RandomAttackDataClient = {
  gameId: number;
  indexPlayer: number;
};

export type AttackService = AttackDataClient & {
  enemyId: number;
  enemyBoard: Map<string, boolean>;
};

export type FinishDataServer = {
  winPlayer: number;
};

export type UpdateWinnersDataServer = {
  name: string;
  wins: number;
};

export type UpdateRoomDataServer = {
  roomId: number;
  roomUsers: RoomUser[];
};
