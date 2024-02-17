import { Room } from '../model/Room.model';
import { roomDb, userDb } from '../store/store';
import { broadcastRoom } from './updateRoom.controller';

export const createRoomController = (id: number) => {
  const newRoom = new Room();
  const { index, name } = userDb.get(id);
  newRoom.addUser({ index, name });

  roomDb.set(newRoom.roomId, newRoom);
  broadcastRoom();
};
