export type UserDataClientType = {
  name: string;
  password: string;
};

export type UserDataType = UserDataClientType & {
  index: number;
  wins: number;
};

export type UserDataServerType = {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
};

type ActionType =
  | 'reg'
  | 'create_game'
  | 'start_game'
  | 'attack'
  | 'turn'
  | 'finish'
  | 'create_room'
  | 'add_user_to_room'
  | 'add_ships'
  | 'randomAttack'
  | 'update_room'
  | 'update_winners';

export type RequestType = {
  type: ActionType;
  data: string;
  id: 0;
};

export enum eRequestType {
  Reg = 'reg',
  UpdateWinners = 'update_winners',
  CreateRoom = 'create_room',
  AddUserToRoom = 'add_user_to_room',
  CreateGame = 'create_game',
  UpdateRoom = 'update_room',
  AddShips = 'add_ships',
  StartGame = 'start_game',
  Attack = 'attack',
  RandomAttack = 'randomAttack',
  Turn = 'turn',
  Finish = 'finish',
}

export type ShipsDataType = {
  gameId: number;
  ships: ShipsType[];
  indexPlayer: number;
};

type PositionType = {
  x: number;
  y: number;
};

export type ShipsType = {
  position: PositionType;
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
};

export type AttackDataType = {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: number;
};

export type AttachFeedBackType = {
  position: PositionType;
  currentPlayer: number;
  status: 'miss' | 'killed' | 'shot';
};
