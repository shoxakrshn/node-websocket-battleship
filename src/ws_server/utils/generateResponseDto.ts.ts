import { RequestType } from '../types/types';
import { eRequestType } from './constants';

export const generateResponseDto = (type: eRequestType, data: string) => {
  const responseMessage: RequestType = { type, data, id: 0 };
  return JSON.stringify(responseMessage);
};
