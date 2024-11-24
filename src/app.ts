import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// routes
// app.use('/api/player/averages', playerAveragesRouter);
// app.use('/api/player/compare', playerCompareRouter);
