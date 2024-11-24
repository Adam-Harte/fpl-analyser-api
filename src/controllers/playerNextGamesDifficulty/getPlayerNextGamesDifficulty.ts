import axios from 'axios';
import { Request, Response } from 'express';

import { HttpCode } from '../../types/httpCode';

export interface GetPlayerNextGamesDifficultyReqQuery {
  firstName: string;
  secondName: string;
  nextGames: string;
}

export const getPlayerNextGamesDifficulty = async (
  req: Request<
    Record<string, string> | undefined,
    unknown,
    unknown,
    GetPlayerNextGamesDifficultyReqQuery,
    Record<string, any>
  >,
  res: Response
) => {
  const { firstName, secondName, nextGames } = req.query;
  const responseData: Record<string, any> = {};

  try {
    const { data: baseData } = await axios.get(
      'https://fantasy.premierleague.com/api/bootstrap-static'
    );

    const player = baseData.elements.filter((element: any) => {
      return (
        element.first_name.toLowerCase() === firstName &&
        element.second_name.toLowerCase() === secondName
      );
    })[0];

    if (player) {
      const { data: playerData } = await axios.get(
        `https://fantasy.premierleague.com/api/element-summary/${player.id}`
      );

      if (playerData && nextGames) {
        const nextGamesData = playerData.fixtures.slice(0, nextGames);
        const nextGameDifficultyTotal = nextGamesData.reduce(
          (acc: any, cur: any) => acc + cur.difficulty,
          0
        );

        const nextGamesDifficultyAverage =
          nextGameDifficultyTotal / parseInt(nextGames, 10);

        responseData.nextGamesDifficultyAverage = nextGamesDifficultyAverage;
      }

      return res.status(HttpCode.OK).json({
        message: 'Player next games difficulty fetched.',
        data: responseData,
      });
    }

    return res.status(HttpCode.BAD_REQUEST).json({
      message: 'No player found please ensure you entered a correct name',
    });
  } catch (err) {
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
      message: err,
    });
  }
};
