import { WebSocketServer } from 'ws';
import { generageUserId } from './utils/generateUserId';
import { eRequestType } from './utils/constants';
import { RequestType } from './types/types';
import { gameDb, roomDb, socketDb, userDb } from './store/store';
import { regController } from './controller/reg.controller';
import { addUserToRoomController } from './controller/addUserToRoom.controller';
import { createRoomController } from './controller/createRoom.controller';
import { addShipsController } from './controller/addShips.controller';
import { attackController } from './controller/attack.controller';
import { randomAttackController } from './controller/randomAttack.controller';
import { singlePlayController } from './controller/singlePlay.controller';
import { generateResponseDto } from './utils/generateResponseDto.ts';
import { broadcastWinners } from './controller/updateWinners.controller';
import { broadcastRoom } from './controller/updateRoom.controller';

const serverInfo = 'This WebSocket server is runing on ws://localhost:3000';

const server = new WebSocketServer({ port: 3000 });
console.log(serverInfo);

server.on('connection', (socket) => {
  const id = generageUserId();
  console.log(`User with id: ${id} is connected`);

  socket.on('message', (message) => {
    const { type, data }: RequestType = JSON.parse(message.toString());
    console.log(`Recieved: [${type}] request`);

    socketDb[id] = socket;

    switch (type) {
      case eRequestType.Reg: {
        regController(id, data);
        break;
      }

      case eRequestType.CreateRoom: {
        createRoomController(id);
        break;
      }

      case eRequestType.AddUserToRoom: {
        addUserToRoomController(id, data);
        break;
      }

      case eRequestType.AddShips: {
        addShipsController(data);
        break;
      }

      case eRequestType.Attack: {
        attackController(data);
        break;
      }

      case eRequestType.RandomAttack: {
        randomAttackController(data);
        break;
      }

      case eRequestType.SinglePlay: {
        singlePlayController(id);
        break;
      }
    }
  });

  socket.on('close', () => {
    console.log(`Connection id: ${id} is closed`);

    const user = userDb.get(id);

    if (user && user.rooms) {
      roomDb.delete(user.rooms[0]);
      broadcastRoom();
    }

    if (user && user.games.length > 0) {
      const game = gameDb.get(user.games[0]);
      const winnerId = game.players.find((playerId) => playerId !== id);
      const winnerDataAnswer = { winPlayer: winnerId };
      const winnerDataAnswerJson = generateResponseDto(eRequestType.Finish, JSON.stringify(winnerDataAnswer));
      if (winnerId in socketDb) {
        socketDb[winnerId].send(winnerDataAnswerJson);
      }
      const userWinner = userDb.get(winnerId);
      userWinner.wins += 1;
      userWinner.clearGame();
      gameDb.delete(game.gameId);
      broadcastWinners();
    }
    userDb.delete(id);
    broadcastWinners();
    socket.close();
  });
});
