import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import {
  getAccountByRiotId,
  getMatch,
  getRecentMatchIds,
} from "./client";
import { RIOT_ROSTER } from "./roster";
import type {
  RiotAccount,
  RiotImportResult,
  RiotRosterPlayer,
} from "./types";

type ResolvedPlayer = {
  player: RiotRosterPlayer;
  account: RiotAccount;
  matchIds: string[];
};

function errorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Unknown import error.";
}

export async function importRecentRosterMatches(
  supabase: SupabaseClient<Database>,
): Promise<RiotImportResult> {
  const result: RiotImportResult = {
    playersResolved: 0,
    playersFailed: 0,
    matchesFound: 0,
    imported: 0,
    skipped: 0,
    failed: 0,
    errors: [],
  };

  const resolvedPlayers: ResolvedPlayer[] = [];

  for (const player of RIOT_ROSTER) {
    try {
      const account = await getAccountByRiotId(
        player.gameName,
        player.tagLine,
      );
      const matchIds = await getRecentMatchIds(account.puuid);

      resolvedPlayers.push({ player, account, matchIds });
      result.playersResolved += 1;
    } catch (error) {
      result.playersFailed += 1;
      result.errors.push(`${player.riotId}: ${errorMessage(error)}`);
    }
  }

  const uniqueMatchIds = [
    ...new Set(resolvedPlayers.flatMap(({ matchIds }) => matchIds)),
  ];

  result.matchesFound = uniqueMatchIds.length;

  if (!uniqueMatchIds.length) {
    return result;
  }

  const { data: existingRows, error: existingError } = await supabase
    .from("riot_matches")
    .select("match_id")
    .in("match_id", uniqueMatchIds);

  if (existingError) {
    result.failed = uniqueMatchIds.length;
    result.errors.push(
      `Could not check existing matches: ${existingError.message}`,
    );
    return result;
  }

  const existingMatchIds = new Set(
    (existingRows ?? []).map(({ match_id }) => match_id),
  );

  for (const matchId of uniqueMatchIds) {
    if (existingMatchIds.has(matchId)) {
      result.skipped += 1;
      continue;
    }

    try {
      const match = await getMatch(matchId);
      const startTimestamp =
        match.info.gameStartTimestamp ?? match.info.gameCreation;
      const endTimestamp =
        match.info.gameEndTimestamp ??
        startTimestamp + match.info.gameDuration * 1000;

      const { error: matchError } = await supabase
        .from("riot_matches")
        .insert({
          match_id: match.metadata.matchId,
          queue_id: match.info.queueId,
          game_mode: match.info.gameMode,
          game_type: match.info.gameType ?? null,
          game_version: match.info.gameVersion ?? null,
          game_start_time: new Date(startTimestamp).toISOString(),
          game_end_time: new Date(endTimestamp).toISOString(),
          game_duration_seconds: Math.max(
            0,
            Math.round(match.info.gameDuration),
          ),
        });

      if (matchError) {
        throw new Error(`Database match save failed: ${matchError.message}`);
      }

      const participantRows = resolvedPlayers.flatMap(
        ({ player, account }) => {
          const participant = match.info.participants.find(
            ({ puuid }) => puuid === account.puuid,
          );

          if (!participant) {
            return [];
          }

          return [
            {
              match_id: match.metadata.matchId,
              puuid: account.puuid,
              riot_id: player.riotId,
              roster_role: player.role,
              participant_id: participant.participantId,
              team_id: participant.teamId,
              champion_id: participant.championId,
              champion_name: participant.championName,
              team_position: participant.teamPosition || null,
              win: participant.win,
              kills: participant.kills,
              deaths: participant.deaths,
              assists: participant.assists,
              total_minions_killed: participant.totalMinionsKilled,
              neutral_minions_killed: participant.neutralMinionsKilled,
              gold_earned: participant.goldEarned,
              vision_score: participant.visionScore,
              total_damage_dealt_to_champions:
                participant.totalDamageDealtToChampions,
              damage_dealt_to_objectives:
                participant.damageDealtToObjectives,
              time_played_seconds:
                participant.timePlayed || match.info.gameDuration,
            },
          ];
        },
      );

      if (participantRows.length) {
        const { error: participantError } = await supabase
          .from("riot_player_matches")
          .upsert(participantRows, {
            onConflict: "match_id,puuid",
          });

        if (participantError) {
          await supabase
            .from("riot_matches")
            .delete()
            .eq("match_id", match.metadata.matchId);

          throw new Error(
            `Database player-stat save failed: ${participantError.message}`,
          );
        }
      }

      result.imported += 1;
    } catch (error) {
      result.failed += 1;
      result.errors.push(`${matchId}: ${errorMessage(error)}`);
    }
  }

  return result;
}