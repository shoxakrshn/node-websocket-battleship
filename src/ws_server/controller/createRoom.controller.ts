import { Room } from '../model/Room.model';
import { roomDb, userDb } from '../store/store';
import { broadcastRoom } from './updateRoom.controller';

export const createRoomController = (id: number) => {
  const newRoom = new Room();
  const user = userDb.get(id);

  if (user.rooms.length > 0) {
    return;
  }

  const { index, name } = userDb.get(id);
  newRoom.addUser({ index, name });
  user.addRoom(newRoom.roomId);

  roomDb.set(newRoom.roomId, newRoom);
  broadcastRoom();
};
