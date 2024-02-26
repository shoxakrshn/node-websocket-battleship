import { getSurroundingCoordinates } from '../utils/getSurroundingCoordinates';
import { gameDb, socketDb, userDb } from '../store/store';
import { AttackDataClient } from '../types/dataTypes';
import { eRequestType, eStatusType } from '../utils/constants';
import { generateResponseDto } from '../utils/generateResponseDto.ts';
import { turnController } from './turn.controller';
import { broadcastWinners } from './updateWinners.controller';
import { getAttackFeedbackDto } from '../utils/getAttackFeedbackDto';

export const attackController = (data: string) => {
  const { gameId, x, y, indexPlayer }: AttackDataClient = JSON.parse(data);
  const game = gameDb.get(gameId);

  if (game.turn !== indexPlayer) {
    return;
  }

  const enemyId = game.players.find((playerId) => playerId !== indexPlayer);
  const enemyBoard = game.board.get(enemyId);

  const playerShips = game.ships.get(enemyId);
  const ship = playerShips.find((ship) => ship.shipPositionMap.has(`${x}-${y}`));

  if (!ship) {
    enemyBoard.set(`${x}-${y}`, true);
    const attackDataFeedbackJson = getAttackFeedbackDto(x, y, indexPlayer, eStatusType.miss);

    game.players.forEach((playerId) => {
      if (playerId in socketDb) {
        socketDb[playerId].send(attackDataFeedbackJson);
      }
    });

    game.turn = enemyId;
    turnController(game.turn, gameId);
    return;
  }

  ship.shipPositionMap.set(`${x}-${y}`, true);
  const shipIndex = playerShips.findIndex((ship) => ship.shipPositionMap.has(`${x}-${y}`));
  playerShips[shipIndex] = ship;
  const status = ship.getStatus();

  switch (status) {
    case eStatusType.shot: {
      enemyBoard.set(`${x}-${y}`, true);

      const attackDataFeedbackJson = getAttackFeedbackDto(x, y, indexPlayer, eStatusType.shot);
      game.players.forEach((playerId) => {
        if (playerId in socketDb) {
          socketDb[playerId].send(attackDataFeedbackJson);
        }
      });

      turnController(indexPlayer, gameId);
      break;
    }

    case eStatusType.killed: {
      const shipCoordinates: number[][] = [];

      ship.shipPositionMap.forEach((_, key) => {
        const coordinates = key.split('-').map(Number);
        shipCoordinates.push(coordinates);
        const [x, y] = coordinates;
        enemyBoard.set(`${x}-${y}`, true);
        const attackDataFeedbackJson = getAttackFeedbackDto(x, y, indexPlayer, eStatusType.killed);

        game.players.forEach((playerId) => {
          if (playerId in socketDb) {
            socketDb[playerId].send(attackDataFeedbackJson);
          }
        });
      });

      const surroundingCoordinates = getSurroundingCoordinates(shipCoordinates);
      surroundingCoordinates.forEach(([x, y]) => {
        if (x > -1 && y > -1 && x < 10 && y < 10) {
          enemyBoard.set(`${x}-${y}`, true);
        }

        const attackDataFeedbackJson = getAttackFeedbackDto(x, y, indexPlayer, eStatusType.miss);

        game.players.forEach((playerId) => {
          if (playerId in socketDb) {
            socketDb[playerId].send(attackDataFeedbackJson);
          }
        });
      });

      turnController(indexPlayer, gameId);

      const isWinner = playerShips.every((playerShip) => playerShip.getStatus() === 'killed');

      if (isWinner) {
        const winnerDataAnswer = { winPlayer: indexPlayer };
        const winnerDataAnswerJson = generateResponseDto(eRequestType.Finish, JSON.stringify(winnerDataAnswer));
        game.players.forEach((playerId) => {
          if (playerId in socketDb) {
            socketDb[playerId].send(winnerDataAnswerJson);
            const user = userDb.get(playerId);
            user.clearGame();
          }
        });

        const userWinner = userDb.get(indexPlayer);
        userWinner.wins += 1;
        gameDb.delete(gameId);
        broadcastWinners();
        break;
      }
    }
  }
};
