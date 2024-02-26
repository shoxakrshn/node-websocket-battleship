import { socketDb, userDb } from '../store/store';
import { eRequestType } from '../utils/constants';
import { generateResponseDto } from '../utils/generateResponseDto.ts';

export const broadcastWinners = () => {
  const users = Array.from(userDb.values());
  const winners = users.filter((user) => user.wins > 0).map(({ name, wins }) => ({ name, wins }));
  const updateWinnersJson = JSON.stringify(winners);
  const updateWinnersAnswer = generateResponseDto(eRequestType.UpdateWinners, updateWinnersJson);

  Object.keys(socketDb).forEach((id) => {
    const socket = socketDb[id];
    socket.send(updateWinnersAnswer);
  });
};
