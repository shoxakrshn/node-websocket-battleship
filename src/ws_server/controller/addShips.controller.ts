import { Ship } from '../model/Ship.model';
import { gameDb, socketDb } from '../store/store';
import { AddShipsDataClinet } from '../types/dataTypes';
import { eRequestType } from '../utils/constants';
import { generateResponseDto } from '../utils/generateResponseDto.ts';
import { turnController } from './turn.controller';

export const addShipsController = (data: string) => {
  const { gameId, ships, indexPlayer }: AddShipsDataClinet = JSON.parse(data);

  const generatedShips: Ship[] = [];
  ships.forEach((ship) => generatedShips.push(new Ship(ship)));

  const game = gameDb.get(gameId);

  game.addShips(indexPlayer, generatedShips);
  game.createBoard(indexPlayer);

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
      const shipsDataAnswerJson = generateResponseDto(eRequestType.StartGame, JSON.stringify(shipsDataAnswer));

      if (playerId in socketDb) {
        socketDb[playerId].send(shipsDataAnswerJson);
      }
    });

    game.turn = players[0];
    turnController(game.turn, gameId);
  }
};
