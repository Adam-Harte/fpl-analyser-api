import express from 'express';

import {
  getPlayerNextGamesDifficulty,
  GetPlayerNextGamesDifficultyReqQuery,
} from '../controllers/playerNextGamesDifficulty/getPlayerNextGamesDifficulty';

export const playerNextGamesDifficultyRouter = express.Router();

playerNextGamesDifficultyRouter.get<
  Record<string, string> | undefined,
  unknown,
  unknown,
  GetPlayerNextGamesDifficultyReqQuery,
  Record<string, any>
>('/player/next-games-difficulty', getPlayerNextGamesDifficulty);
