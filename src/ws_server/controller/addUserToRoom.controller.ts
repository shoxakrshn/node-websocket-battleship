import { Game } from '../model/Game.model';
import { gameDb, roomDb, socketDb, userDb } from '../store/store';
import { AddUserToRoomDataClinet } from '../types/dataTypes';
import { eRequestType } from '../utils/constants';
import { generateResponseDto } from '../utils/generateResponseDto.ts';
import { broadcastRoom } from './updateRoom.controller';

export const addUserToRoomController = (id: number, data: string) => {
  const { indexRoom }: AddUserToRoomDataClinet = JSON.parse(data);
  const room = roomDb.get(indexRoom);
  const { index, name } = userDb.get(id);

  const isUserInRoom = room.roomUsers.find((user) => user.index === id);
  if (isUserInRoom) {
    console.log('Fail: The user is already in the Room');
    return;
  }

  room.addUser({ index, name });

  const newGame = new Game();
  room.roomUsers.forEach(({ index }) => newGame.addPlayer(index));
  gameDb.set(newGame.gameId, newGame);

  room.roomUsers.forEach(({ index }) => {
    const updateGameJson = JSON.stringify({ idGame: newGame.gameId, idPlayer: index });
    const updateGameAnswer = generateResponseDto(eRequestType.CreateGame, updateGameJson);
    const socket = socketDb[index];
    socket.send(updateGameAnswer);
  });

  roomDb.delete(indexRoom);
  room.roomUsers.forEach(({ index }) => {
    const user = userDb.get(index);
    user.rooms.forEach((userRoom) => roomDb.delete(userRoom));
    user.clearRoom();
  });

  broadcastRoom();
};
