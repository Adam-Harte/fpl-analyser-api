import express from 'express';

import {
  getPlayerSeasonStats,
  GetPlayerSeasonStatsReqQuery,
} from '../controllers/playerSeasonStats/getPlayerSeasonStats';

export const playerSeasonStatsRouter = express.Router();

playerSeasonStatsRouter.get<
  Record<string, string> | undefined,
  unknown,
  unknown,
  GetPlayerSeasonStatsReqQuery,
  Record<string, any>
>('/player/season-stats', getPlayerSeasonStats);
