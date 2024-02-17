import { ShipsType } from '../types/types';

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
  SinglePlay = 'single_play',
}

export enum eStatusType {
  miss = 'miss',
  shot = 'shot',
  killed = 'killed',
}

export const shipsBot: ShipsType[] = [
  {
    position: { x: 5, y: 9 },
    direction: false,
    type: 'huge',
    length: 4,
  },
  {
    position: { x: 4, y: 3 },
    direction: true,
    type: 'large',
    length: 3,
  },
  {
    position: { x: 0, y: 5 },
    direction: false,
    type: 'large',
    length: 3,
  },
  {
    position: { x: 3, y: 0 },
    direction: true,
    type: 'medium',
    length: 2,
  },
  {
    position: { x: 6, y: 4 },
    direction: false,
    type: 'medium',
    length: 2,
  },
  {
    position: { x: 0, y: 7 },
    direction: false,
    type: 'medium',
    length: 2,
  },
  {
    position: { x: 6, y: 0 },
    direction: true,
    type: 'small',
    length: 1,
  },
  {
    position: { x: 2, y: 9 },
    direction: false,
    type: 'small',
    length: 1,
  },
  {
    position: { x: 1, y: 3 },
    direction: false,
    type: 'small',
    length: 1,
  },
  {
    position: { x: 4, y: 7 },
    direction: true,
    type: 'small',
    length: 1,
  },
];
