import { AttackDataServer } from '../types/dataTypes';
import { eRequestType, eStatusType } from './constants';
import { generateResponseDto } from './generateResponseDto.ts';

export const getAttackFeedbackDto = (x: number, y: number, PlayerId: number, status: eStatusType) => {
  const attackDataFeedback: AttackDataServer = {
    position: { x, y },
    currentPlayer: PlayerId,
    status,
  };

  const attackDataFeedbackJson = generateResponseDto(eRequestType.Attack, JSON.stringify(attackDataFeedback));
  return attackDataFeedbackJson;
};
