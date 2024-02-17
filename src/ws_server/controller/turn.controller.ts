import { gameDb, socketDb } from '../store/store';
import { RandomAttackDataClient } from '../types/dataTypes';
import { eRequestType } from '../utils/constants';
import { generateResponseDto } from '../utils/generateResponseDto.ts';
import { randomAttackController } from './randomAttack.controller';

export const turnController = (playerId: number, gameId: number) => {
  const game = gameDb.get(gameId);
  const turnDataAnswer = { currentPlayer: playerId };
  const turnDataAnswerJson = generateResponseDto(eRequestType.Turn, JSON.stringify(turnDataAnswer));
  game.players.forEach((playerId) => {
    if (playerId in socketDb) {
      socketDb[playerId].send(turnDataAnswerJson);
    }
  });
  if (playerId === 99999) {
    const data: RandomAttackDataClient = {
      gameId: game.gameId,
      indexPlayer: playerId,
    };
    randomAttackController(JSON.stringify(data));
  }
};
