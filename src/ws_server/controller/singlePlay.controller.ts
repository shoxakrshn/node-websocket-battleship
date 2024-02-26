import { Game } from '../model/Game.model';
import { Room } from '../model/Room.model';
import { Ship } from '../model/Ship.model';
import { gameDb, roomDb, socketDb, userDb } from '../store/store';
import { eRequestType, shipsBot } from '../utils/constants';
import { generateResponseDto } from '../utils/generateResponseDto.ts';
import { broadcastRoom } from './updateRoom.controller';

export const singlePlayController = (id: number) => {
  const room = new Room();
  const { index, name } = userDb.get(id);
  room.addUser({ index, name });
  room.addUser({ index: 99999, name: 'bot' });

  roomDb.set(room.roomId, room);

  const newGame = new Game();

  room.roomUsers.forEach(({ index }) => newGame.addPlayer(index));
  gameDb.set(newGame.gameId, newGame);

  const user = userDb.get(index);
  user.rooms.forEach((userRoom) => roomDb.delete(userRoom));
  user.clearRoom();

  const updateGameJson = JSON.stringify({ idGame: newGame.gameId, idPlayer: index });
  const updateGameAnswer = generateResponseDto(eRequestType.CreateGame, updateGameJson);
  const socket = socketDb[index];
  socket.send(updateGameAnswer);

  const generatedShips: Ship[] = [];
  shipsBot.forEach((ship) => generatedShips.push(new Ship(ship)));

  newGame.addShips(99999, generatedShips);
  newGame.createBoard(99999);

  roomDb.delete(room.roomId);
  broadcastRoom();
};
