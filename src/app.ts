import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { playerComparisonRouter } from './routes/playerComparison';
import { playerNextGamesDifficultyRouter } from './routes/playerNextGamesDifficulty';
import { playerPreviousGamesStatsRouter } from './routes/playerPreviousGamesStats';
import { playerSeasonStatsRouter } from './routes/playerSeasonStats';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// routes
app.use('/api', playerSeasonStatsRouter);
app.use('/api', playerPreviousGamesStatsRouter);
app.use('/api', playerNextGamesDifficultyRouter);
app.use('/api', playerComparisonRouter);
