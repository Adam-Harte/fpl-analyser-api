import axios from 'axios';
import { Request, Response } from 'express';

import { HttpCode } from '../../types/httpCode';

export interface GetPlayerComparisonReqQuery {
  firstName: string;
  secondName: string;
  prevGames: string;
  nextGames: string;
  minPrice: string;
  maxPrice: string;
}

export const getPlayerComparison = async (
  req: Request<
    Record<string, string> | undefined,
    unknown,
    unknown,
    GetPlayerComparisonReqQuery,
    Record<string, any>
  >,
  res: Response
) => {
  const { firstName, secondName, prevGames, nextGames, minPrice, maxPrice } =
    req.query;
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
      const otherPlayers = baseData.elements
        .filter((element: any) => {
          const baseCondition =
            element.first_name !== player.first_name &&
            element.second_name !== player.second_name &&
            element.element_type === player.element_type &&
            element.minutes > 0 &&
            element.total_points > 0;

          if (minPrice && maxPrice) {
            return (
              baseCondition &&
              element.now_cost >= parseInt(minPrice, 10) &&
              element.now_cost <= parseInt(maxPrice, 10)
            );
          }

          if (minPrice) {
            return baseCondition && element.now_cost >= parseInt(minPrice, 10);
          }

          if (maxPrice) {
            return baseCondition && element.now_cost <= parseInt(maxPrice, 10);
          }

          return baseCondition;
        })
        .sort(
          (a: any, b: any) => parseFloat(a.ict_index) - parseFloat(b.ict_index)
        )
        .slice(0, 20);

      const { data: playerData } = await axios.get(
        `https://fantasy.premierleague.com/api/element-summary/${player.id}`
      );

      responseData.playerData = playerData;

      if (otherPlayers) {
        responseData.otherPlayersData = [];

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < otherPlayers.length; i++) {
          // eslint-disable-next-line no-await-in-loop
          const { data } = await axios.get(
            `https://fantasy.premierleague.com/api/element-summary/${otherPlayers[i].id}`
          );

          const webName = otherPlayers[i].web_name;
          const prevGamesData = data.history.slice(-prevGames);
          const nextGamesData = data.fixtures.slice(0, nextGames);
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
            (acc: any, cur: any) =>
              acc + parseFloat(cur.expected_goals_conceded),
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
          const prevGamesXgiAverage =
            prevGamesXgiTotal / parseInt(prevGames, 10);
          const prevGamesXgcAverage =
            prevGamesXgcTotal / parseInt(prevGames, 10);
          const nextGameDifficultyTotal = nextGamesData.reduce(
            (acc: any, cur: any) => acc + cur.difficulty,
            0
          );

          const nextGamesDifficultyAverage =
            nextGameDifficultyTotal / parseInt(nextGames, 10);

          responseData.otherPlayersData = [
            ...responseData.otherPlayersData,
            {
              webName,
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
              nextGamesDifficultyAverage,
            },
          ];
        }
      }

      return res.status(HttpCode.OK).json({
        message: 'Player comparison stats fetched.',
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
