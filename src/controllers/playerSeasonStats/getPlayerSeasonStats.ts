/* eslint-disable camelcase */
import axios from 'axios';
import { Request, Response } from 'express';

import { HttpCode } from '../../types/httpCode';

export interface GetPlayerSeasonStatsReqQuery {
  firstName: string;
  secondName: string;
}

export const getPlayerSeasonStats = async (
  req: Request<
    Record<string, string> | undefined,
    unknown,
    unknown,
    GetPlayerSeasonStatsReqQuery,
    Record<string, any>
  >,
  res: Response
) => {
  const { firstName, secondName } = req.query;

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
      const {
        element_type,
        web_name,
        now_cost,
        points_per_game,
        selected_by_percent,
        goals_scored,
        assists,
        clean_sheets,
        goals_conceded,
        penalties_saved,
        penalties_missed,
        yellow_cards,
        saves,
        bonus,
        ict_index,
        expected_goals,
        expected_assists,
        expected_goal_involvements,
        expected_goals_conceded,
        penalties_order,
        expected_goals_per_90,
        saves_per_90,
        expected_assists_per_90,
        expected_goal_involvements_per_90,
        expected_goals_conceded_per_90,
        goals_conceded_per_90,
        clean_sheets_per_90,
      } = player;

      const generalStats = {
        web_name,
        now_cost,
        points_per_game,
        selected_by_percent,
        bonus,
      };

      const keeperStats = {
        clean_sheets,
        goals_conceded,
        penalties_saved,
        saves,
        ict_index,
        expected_goals_conceded,
        saves_per_90,
        expected_goals_conceded_per_90,
        goals_conceded_per_90,
        clean_sheets_per_90,
      };

      const defenderStats = {
        goals_scored,
        assists,
        clean_sheets,
        goals_conceded,
        yellow_cards,
        ict_index,
        expected_goals,
        expected_assists,
        expected_goal_involvements,
        expected_goals_conceded,
        expected_goals_per_90,
        expected_assists_per_90,
        expected_goal_involvements_per_90,
        expected_goals_conceded_per_90,
        goals_conceded_per_90,
        clean_sheets_per_90,
      };

      const midfielderStats = {
        goals_scored,
        assists,
        penalties_missed,
        yellow_cards,
        ict_index,
        expected_goals,
        expected_assists,
        expected_goal_involvements,
        penalties_order,
        expected_goals_per_90,
        expected_assists_per_90,
        expected_goal_involvements_per_90,
      };

      const attackerStats = {
        goals_scored,
        assists,
        penalties_missed,
        ict_index,
        expected_goals,
        expected_assists,
        expected_goal_involvements,
        penalties_order,
        expected_goals_per_90,
        expected_assists_per_90,
        expected_goal_involvements_per_90,
      };

      const otherPlayers = baseData.elements.filter((element: any) => {
        return (
          element.first_name !== player.first_name &&
          element.second_name !== player.second_name &&
          element.element_type === player.element_type &&
          element.minutes > 0 &&
          element.total_points > 0
        );
      });

      const replacementPoints = Math.min(
        ...otherPlayers.map((player: any) => player.total_points)
      );
      const replacementIctIndex = Math.min(
        ...otherPlayers.map((player: any) => player.ict_index)
      );

      const vorp =
        (player.total_points +
          player.ict_index -
          (replacementPoints + replacementIctIndex)) /
        player.now_cost;

      return res.status(HttpCode.OK).json({
        message: 'Player stats fetched.',
        data: {
          ...generalStats,
          ...(element_type === 1 && { ...keeperStats }),
          ...(element_type === 2 && { ...defenderStats }),
          ...(element_type === 3 && { ...midfielderStats }),
          ...(element_type === 4 && { ...attackerStats }),
          vorp,
        },
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
