import WebSocket, { WebSocketServer } from 'ws';
import type {
  AttachFeedBackType,
  AttackDataType,
  RequestType,
  ShipsDataType,
  UserDataClientType,
  UserDataServerType,
  UserDataType,
} from './type';
import { eRequestType } from './type';

import { generageUserId } from './generateUserId';
import User from './model/User.model';
import { Room } from './model/Room.model';
import { Ship } from './model/Ship.model';
import { Game } from './model/Game.model';
import { getSurroundingCoordinates } from './check';

const userDb = new Map<number, UserDataType>();
const roomDb = new Map<number, Room>();
const gameDb = new Map<number, Game>();

const server = new WebSocketServer({ port: 3000 });
type SocketsStoreType = {
  [x: string]: WebSocket;
};
const socketsStore: SocketsStoreType = {};

type AddUserToRoomType = {
  indexRoom: number;
};

type CoordinationType = number[];

const generateResponseMessage = (type: eRequestType, data: string) => {
  const responseMessage: RequestType = { type, data, id: 0 };
  return JSON.stringify(responseMessage);
};

const broadcastRoom = () => {
  const rooms: Room[] = Array.from(roomDb.values());

  const updateRoomJson = JSON.stringify(rooms);
  const updateRoomAnswer = generateResponseMessage(eRequestType.UpdateRoom, updateRoomJson);

  Object.keys(socketsStore).forEach((id) => {
    const socket = socketsStore[id];
    socket.send(updateRoomAnswer);
  });
};

const broadcastWinners = () => {
  const users = Array.from(userDb.values());
  const winners = users.filter((user) => user.wins > 0).map(({ name, wins }) => ({ name, wins }));
  const updateWinnersJson = JSON.stringify(winners);
  const updateWinnersAnswer = generateResponseMessage(eRequestType.UpdateWinners, updateWinnersJson);

  Object.keys(socketsStore).forEach((id) => {
    const socket = socketsStore[id];
    socket.send(updateWinnersAnswer);
  });
};

server.on('connection', (socket) => {
  const id = generageUserId();

  socket.on('message', (message) => {
    const { type, data }: RequestType = JSON.parse(message.toString());

    socketsStore[id] = socket;

    switch (type) {
      case eRequestType.Reg: {
        const { name, password }: UserDataClientType = JSON.parse(data);

        //should be user validation
        const newUser = new User(id, name, password);
        userDb.set(id, newUser);

        const userData: UserDataServerType = {
          name: newUser.name,
          index: newUser.index,
          error: false,
          errorText: '',
        };

        const userDataJson = JSON.stringify(userData);
        const answer = generateResponseMessage(eRequestType.Reg, userDataJson);

        socket.send(answer);
        broadcastRoom();
        broadcastWinners();

        break;
      }

      case eRequestType.CreateRoom: {
        const newRoom = new Room();
        const { index, name } = userDb.get(id);
        newRoom.addUser({ index, name });

        roomDb.set(newRoom.roomId, newRoom);
        broadcastRoom();
        break;
      }

      case eRequestType.AddUserToRoom: {
        const { indexRoom }: AddUserToRoomType = JSON.parse(data);
        const room = roomDb.get(indexRoom);
        const { index, name } = userDb.get(id);
        room.addUser({ index, name });
        broadcastRoom();

        const newGame = new Game();
        room.roomUsers.forEach(({ index }) => newGame.addPlayer(index));
        gameDb.set(newGame.gameId, newGame);

        room.roomUsers.forEach(({ index }) => {
          const updateGameJson = JSON.stringify({ idGame: newGame.gameId, idPlayer: index });
          const updateGameAnswer = generateResponseMessage(eRequestType.CreateGame, updateGameJson);
          const socket = socketsStore[index];
          socket.send(updateGameAnswer);
        });
        break;
      }

      case eRequestType.AddShips: {
        const { gameId, ships, indexPlayer }: ShipsDataType = JSON.parse(data);
        const generatedShips: Ship[] = [];
        ships.forEach((ship) => generatedShips.push(new Ship(ship)));

        const game = gameDb.get(gameId);

        game.addShips(indexPlayer, generatedShips);

        if (game.ships.size === 2) {
          const { players } = game;

          players.forEach((playerId) => {
            const playerShips = game.ships.get(playerId);
            const ships = playerShips.map(({ position, direction, length, type }) => ({
              position,
              direction,
              length,
              type,
            }));

            const shipsDataAnswer = { gameId, ships, currentPlayerIndex: playerId };
            const shipsDataAnswerJson = generateResponseMessage(
              eRequestType.StartGame,
              JSON.stringify(shipsDataAnswer),
            );

            socketsStore[playerId].send(shipsDataAnswerJson);
          });

          game.turn = players[0];

          const turnDataAnswer = { currentPlayer: game.turn };
          const turnDataAnswerJson = generateResponseMessage(eRequestType.Turn, JSON.stringify(turnDataAnswer));
          players.forEach((palyerId) => {
            socketsStore[palyerId].send(turnDataAnswerJson);
          });
        }
        break;
      }

      case eRequestType.Attack: {
        const { gameId, x, y, indexPlayer }: AttackDataType = JSON.parse(data);

        const game = gameDb.get(gameId);

        if (game.turn !== indexPlayer) {
          return;
        }

        const enemyId = game.players.find((playerId) => playerId !== indexPlayer);
        const playerShips = game.ships.get(enemyId);
        const ship = playerShips.find((ship) => ship.shipPositionMap.has(`${x}-${y}`));
        console.log('ship: ', ship);

        if (ship) {
          ship.shipPositionMap.set(`${x}-${y}`, true);
          const shipIndex = playerShips.findIndex((ship) => ship.shipPositionMap.has(`${x}-${y}`));
          playerShips[shipIndex] = ship;
          game.ships.set(enemyId, playerShips);
          gameDb.set(gameId, game);
          const status = ship.getStatus();

          const attackFeedback: AttachFeedBackType = { position: { x, y }, currentPlayer: indexPlayer, status };
          const attackFeedbackJson = generateResponseMessage(eRequestType.Attack, JSON.stringify(attackFeedback));

          console.log(status);
          if (status === 'shot') {
            game.players.forEach((palyerId) => {
              socketsStore[palyerId].send(attackFeedbackJson);
            });
            const turnDataAnswer = { currentPlayer: indexPlayer };
            const turnDataAnswerJson = generateResponseMessage(eRequestType.Turn, JSON.stringify(turnDataAnswer));
            game.players.forEach((palyerId) => {
              socketsStore[palyerId].send(turnDataAnswerJson);
            });
          } else {
            const shipCoordinates: CoordinationType[] = [];
            ship.shipPositionMap.forEach((_, key) => {
              const coordinates = key.split('-').map(Number);
              shipCoordinates.push(coordinates);
              const [x, y] = coordinates;
              const attackKilledFeedback: AttachFeedBackType = {
                position: { x, y },
                currentPlayer: indexPlayer,
                status,
              };
              const attackKilledFeedbackJson = generateResponseMessage(
                eRequestType.Attack,
                JSON.stringify(attackKilledFeedback),
              );
              game.players.forEach((palyerId) => {
                socketsStore[palyerId].send(attackKilledFeedbackJson);
              });
            });

            const surroundingCoordinates = getSurroundingCoordinates(shipCoordinates);
            surroundingCoordinates.forEach(([x, y]) => {
              const attackKilledFeedback: AttachFeedBackType = {
                position: { x, y },
                currentPlayer: indexPlayer,
                status: 'miss',
              };
              const attackKilledFeedbackJson = generateResponseMessage(
                eRequestType.Attack,
                JSON.stringify(attackKilledFeedback),
              );
              game.players.forEach((palyerId) => {
                socketsStore[palyerId].send(attackKilledFeedbackJson);
              });
            });
            const turnDataAnswer = { currentPlayer: indexPlayer };
            const turnDataAnswerJson = generateResponseMessage(eRequestType.Turn, JSON.stringify(turnDataAnswer));
            game.players.forEach((palyerId) => {
              socketsStore[palyerId].send(turnDataAnswerJson);
            });

            const isWinner = playerShips.every((playerShip) => playerShip.getStatus() === 'killed');
            console.log(isWinner);
            if (isWinner) {
              const winnerDataAnswer = { winPlayer: indexPlayer };
              const winnerDataAnswerJson = generateResponseMessage(
                eRequestType.Finish,
                JSON.stringify(winnerDataAnswer),
              );
              game.players.forEach((palyerId) => {
                socketsStore[palyerId].send(winnerDataAnswerJson);
              });

              const userWiiner = userDb.get(indexPlayer);
              userWiiner.wins += 1;
              broadcastWinners();
            }
          }
        } else {
          game.turn = enemyId;
          gameDb.set(gameId, game);
          const attackMissFeedback: AttachFeedBackType = {
            position: { x, y },
            currentPlayer: indexPlayer,
            status: 'miss',
          };

          const attackMissFeedbackJson = generateResponseMessage(
            eRequestType.Attack,
            JSON.stringify(attackMissFeedback),
          );
          game.players.forEach((palyerId) => {
            socketsStore[palyerId].send(attackMissFeedbackJson);
          });

          const turnDataAnswer = { currentPlayer: enemyId };
          const turnDataAnswerJson = generateResponseMessage(eRequestType.Turn, JSON.stringify(turnDataAnswer));
          game.players.forEach((palyerId) => {
            socketsStore[palyerId].send(turnDataAnswerJson);
          });
        }

        break;
      }
    }
  });
});
