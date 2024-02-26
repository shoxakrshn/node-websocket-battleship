import { Room } from '../model/Room.model';
import { roomDb, socketDb } from '../store/store';
import { eRequestType } from '../utils/constants';
import { generateResponseDto } from '../utils/generateResponseDto.ts';

export const broadcastRoom = () => {
  const rooms: Room[] = Array.from(roomDb.values());

  const updateRoomJson = JSON.stringify(rooms);
  const updateRoomAnswer = generateResponseDto(eRequestType.UpdateRoom, updateRoomJson);

  Object.keys(socketDb).forEach((id) => {
    const socket = socketDb[id];
    socket.send(updateRoomAnswer);
  });
};
