import express from 'express';

import {
  getPlayerPreviousGamesStats,
  GetPlayerPreviousGamesStatsReqQuery,
} from '../controllers/playerPreviousGamesStats/getPlayerPreviousGamesStats';

export const playerPreviousGamesStatsRouter = express.Router();

playerPreviousGamesStatsRouter.get<
  Record<string, string> | undefined,
  unknown,
  unknown,
  GetPlayerPreviousGamesStatsReqQuery,
  Record<string, any>
>('/player/previous-games-stats', getPlayerPreviousGamesStats);
