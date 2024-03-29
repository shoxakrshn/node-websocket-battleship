import { eRequestType } from '../utils/constants';

export type RequestType = {
  type: eRequestType;
  data: string;
  id: 0;
};

export type RoomUser = {
  name: number;
  index: number;
};

export type Status = 'miss' | 'shot' | 'killed';

export type Position = {
  x: number;
  y: number;
};

export type ShipsType = {
  position: Position;
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
};
