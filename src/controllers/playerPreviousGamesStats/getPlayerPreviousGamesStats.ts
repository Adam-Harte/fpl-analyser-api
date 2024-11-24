import axios from 'axios';
import { Request, Response } from 'express';

import { HttpCode } from '../../types/httpCode';

export interface GetPlayerPreviousGamesStatsReqQuery {
  firstName: string;
  secondName: string;
  prevGames: string;
}

export const getPlayerPreviousGamesStats = async (
  req: Request<
    Record<string, string> | undefined,
    unknown,
    unknown,
    GetPlayerPreviousGamesStatsReqQuery,
    Record<string, any>
  >,
  res: Response
) => {
  const { firstName, secondName, prevGames } = req.query;
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

      if (playerData && prevGames) {
        const prevGamesData = playerData.history.slice(-prevGames);
        const prevGamesGoalsTotal = prevGamesData.reduce(
          (acc: any, cur: any) => acc + cur.goals_scored,
          0
        );
        const prevGamesAssistsTotal = prevGamesData.reduce(
          (acc: any, cur: any) => acc + cur.assists,
          0
        );
        const prevGamesCleanSheetsTotal = prevGamesData.reduce(
          (acc: any, cur: any) => acc + cur.clean_sheets,
          0
        );
        const prevGamesYellowCardsTotal = prevGamesData.reduce(
          (acc: any, cur: any) => acc + cur.yellow_cards,
          0
        );
        const prevGamesBonusTotal = prevGamesData.reduce(
          (acc: any, cur: any) => acc + cur.bonus,
          0
        );
        const prevGamesIctIndexTotal = prevGamesData.reduce(
          (acc: any, cur: any) => acc + parseFloat(cur.ict_index),
          0
        );
        const prevGamesXgTotal = prevGamesData.reduce(
          (acc: any, cur: any) => acc + parseFloat(cur.expected_goals),
          0
        );
        const prevGamesXaTotal = prevGamesData.reduce(
          (acc: any, cur: any) => acc + parseFloat(cur.expected_assists),
          0
        );
        const prevGamesXgiTotal = prevGamesData.reduce(
          (acc: any, cur: any) =>
            acc + parseFloat(cur.expected_goal_involvements),
          0
        );
        const prevGamesXgcTotal = prevGamesData.reduce(
          (acc: any, cur: any) => acc + parseFloat(cur.expected_goals_conceded),
          0
        );

        const prevGamesGoalsAverage =
          prevGamesGoalsTotal / parseInt(prevGames, 10);
        const prevGamesAssistsAverage =
          prevGamesAssistsTotal / parseInt(prevGames, 10);
        const prevGamesCleanSheetsAverage =
          prevGamesCleanSheetsTotal / parseInt(prevGames, 10);
        const prevGamesYellowCardsAverage =
          prevGamesYellowCardsTotal / parseInt(prevGames, 10);
        const prevGamesBonusAverage =
          prevGamesBonusTotal / parseInt(prevGames, 10);
        const ictIndexAverage =
          prevGamesIctIndexTotal / parseInt(prevGames, 10);
        const prevGamesXgAverage = prevGamesXgTotal / parseInt(prevGames, 10);
        const prevGamesXaAverage = prevGamesXaTotal / parseInt(prevGames, 10);
        const prevGamesXgiAverage = prevGamesXgiTotal / parseInt(prevGames, 10);
        const prevGamesXgcAverage = prevGamesXgcTotal / parseInt(prevGames, 10);

        responseData.previousGamesAverages = {
          prevGamesGoalsAverage,
          prevGamesAssistsAverage,
          prevGamesCleanSheetsAverage,
          prevGamesYellowCardsAverage,
          prevGamesBonusAverage,
          ictIndexAverage,
          prevGamesXgAverage,
          prevGamesXaAverage,
          prevGamesXgiAverage,
          prevGamesXgcAverage,
        };
      }

      return res.status(HttpCode.OK).json({
        message: 'Player previous games stats fetched.',
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
