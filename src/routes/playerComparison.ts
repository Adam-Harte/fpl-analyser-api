import express from 'express';

import {
  getPlayerComparison,
  GetPlayerComparisonReqQuery,
} from '../controllers/playerComparison/getPlayerComparison';

export const playerComparisonRouter = express.Router();

playerComparisonRouter.get<
  Record<string, string> | undefined,
  unknown,
  unknown,
  GetPlayerComparisonReqQuery,
  Record<string, any>
>('/player/comparison', getPlayerComparison);
