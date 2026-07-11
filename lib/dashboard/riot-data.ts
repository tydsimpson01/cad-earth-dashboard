import "server-only";

import { RIOT_ROSTER } from "@/lib/riot/roster";
import { createClient } from "@/lib/supabase/server";
import type {
  DashboardData,
  MatchReview,
  Player,
  Role,
  TeamMetric,
} from "@/types/dashboard";
import type { Database } from "@/types/database";

type MatchRow = Database["public"]["Tables"]["riot_matches"]["Row"];
type PlayerMatchRow =
  Database["public"]["Tables"]["riot_player_matches"]["Row"];

const goalsByRiotId: Record<string, string> = {
  "chico#3456": "CS >= 8/min",
  "Aigis#SEES": "Earlier objective setup",
  "Nemoupi#2427": "Roam on first reset",
  "redakted#GONE": "Fewer late deaths",
  "Rylionn#NA1": "Vision before dragon",
};

function clamp(value: number, minimum = 0, maximum = 100) {
  return Math.min(maximum, Math.max(minimum, value));
}

function percent(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

function roleFrom(value: string): Role {
  const role = value.toUpperCase();

  if (role === "TOP") return "TOP";
  if (role === "JUNGLE") return "JUNGLE";
  if (role === "MID") return "MID";
  if (role === "BOT") return "BOT";
  return "SUPPORT";
}

function formatDuration(seconds: number) {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function relativeTime(value: string | null) {
  if (!value) return "Unknown time";

  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "Unknown time";

  const difference = Math.max(0, Date.now() - timestamp);
  const minutes = Math.floor(difference / 60_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  if (days < 14) return `${days} day${days === 1 ? "" : "s"} ago`;

  return new Date(value).toLocaleDateString();
}

function queueLabel(queueId: number | null) {
  const labels: Record<number, string> = {
    0: "Custom",
    400: "Normal Draft",
    420: "Ranked Solo",
    430: "Normal Blind",
    440: "Ranked Flex",
    450: "ARAM",
    490: "Quickplay",
  };

  return queueId === null ? "League match" : labels[queueId] ?? `Queue ${queueId}`;
}

function topChampions(rows: PlayerMatchRow[]) {
  const counts = new Map<string, number>();

  rows.forEach((row) => {
    if (!row.champion_name) return;
    counts.set(row.champion_name, (counts.get(row.champion_name) ?? 0) + 1);
  });

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 3)
    .map(([champion]) => champion);
}

function buildPlayers(rows: PlayerMatchRow[]): Player[] {
  return RIOT_ROSTER.map((rosterPlayer) => {
    const playerRows = rows.filter(
      (row) => row.riot_id === rosterPlayer.riotId,
    );
    const games = playerRows.length;
    const wins = playerRows.filter((row) => row.win).length;
    const kills = playerRows.reduce((sum, row) => sum + row.kills, 0);
    const deaths = playerRows.reduce((sum, row) => sum + row.deaths, 0);
    const assists = playerRows.reduce((sum, row) => sum + row.assists, 0);
    const totalCs = playerRows.reduce(
      (sum, row) =>
        sum + row.total_minions_killed + row.neutral_minions_killed,
      0,
    );
    const totalSeconds = playerRows.reduce(
      (sum, row) => sum + row.time_played_seconds,
      0,
    );
    const totalMinutes = totalSeconds / 60;

    return {
      id: rosterPlayer.riotId,
      name: rosterPlayer.gameName,
      role: roleFrom(rosterPlayer.role),
      rank: `${games} game${games === 1 ? "" : "s"}`,
      winRate: `${percent(wins, games)}%`,
      kda: games ? ((kills + assists) / Math.max(1, deaths)).toFixed(2) : "0.00",
      csPerMinute: totalMinutes ? (totalCs / totalMinutes).toFixed(1) : "0.0",
      killParticipation: games
        ? ((kills + assists) / games).toFixed(1)
        : "0.0",
      goal: goalsByRiotId[rosterPlayer.riotId] ?? "Review recent games",
      champions: topChampions(playerRows),
    };
  });
}

function buildMatches(
  playerRows: PlayerMatchRow[],
  matchRows: MatchRow[],
): MatchReview[] {
  const matchesById = new Map(
    matchRows.map((match) => [match.match_id, match]),
  );

  return [...playerRows]
    .sort((left, right) => {
      const leftTime = matchesById.get(left.match_id)?.game_start_time ?? "";
      const rightTime = matchesById.get(right.match_id)?.game_start_time ?? "";
      return rightTime.localeCompare(leftTime);
    })
    .slice(0, 15)
    .map((row) => {
      const match = matchesById.get(row.match_id);
      const minutes = row.time_played_seconds / 60;
      const cs =
        row.total_minions_killed + row.neutral_minions_killed;
      const csPerMinute = minutes ? (cs / minutes).toFixed(1) : "0.0";

      return {
        result: row.win ? "Victory" : "Defeat",
        score: `${row.kills} / ${row.deaths} / ${row.assists}`,
        duration: formatDuration(
          row.time_played_seconds ||
            match?.game_duration_seconds ||
            0,
        ),
        when: relativeTime(match?.game_start_time ?? null),
        composition: `${row.riot_id} | ${row.champion_name ?? "Unknown"}`,
        notes: `${csPerMinute} CS/min | ${row.vision_score} vision | ${row.total_damage_dealt_to_champions.toLocaleString()} champion damage`,
        tags: [
          queueLabel(match?.queue_id ?? null),
          row.roster_role,
        ],
      };
    });
}

function buildMetrics(
  playerRows: PlayerMatchRow[],
  matchRows: MatchRow[],
): TeamMetric[] {
  const games = playerRows.length;
  const wins = playerRows.filter((row) => row.win).length;
  const kills = playerRows.reduce((sum, row) => sum + row.kills, 0);
  const deaths = playerRows.reduce((sum, row) => sum + row.deaths, 0);
  const assists = playerRows.reduce((sum, row) => sum + row.assists, 0);
  const totalCs = playerRows.reduce(
    (sum, row) =>
      sum + row.total_minions_killed + row.neutral_minions_killed,
    0,
  );
  const totalSeconds = playerRows.reduce(
    (sum, row) => sum + row.time_played_seconds,
    0,
  );
  const averageGameSeconds = matchRows.length
    ? matchRows.reduce(
        (sum, match) => sum + match.game_duration_seconds,
        0,
      ) / matchRows.length
    : 0;
  const winRate = percent(wins, games);
  const averageKda = games
    ? (kills + assists) / Math.max(1, deaths)
    : 0;
  const averageCsPerMinute = totalSeconds
    ? totalCs / (totalSeconds / 60)
    : 0;
  const latestImport = [...matchRows]
    .sort((left, right) => right.imported_at.localeCompare(left.imported_at))[0];

  return [
    {
      label: "Roster Sample Win Rate",
      value: `${winRate}%`,
      delta: `${wins}W - ${games - wins}L`,
      sentiment: winRate >= 50 ? "positive" : "negative",
      progress: winRate,
    },
    {
      label: "Roster Avg KDA",
      value: averageKda.toFixed(2),
      delta: `${kills} / ${deaths} / ${assists}`,
      sentiment: averageKda >= 2.5 ? "positive" : "neutral",
      progress: clamp(averageKda * 20),
    },
    {
      label: "Roster Avg CS / Min",
      value: averageCsPerMinute.toFixed(1),
      delta: `${games} player games`,
      sentiment: averageCsPerMinute >= 6 ? "positive" : "neutral",
      progress: clamp(averageCsPerMinute * 10),
    },
    {
      label: "Average Game",
      value: formatDuration(averageGameSeconds),
      delta: `${matchRows.length} unique matches`,
      sentiment: "neutral",
      progress: clamp((averageGameSeconds / 2400) * 100),
    },
    {
      label: "Imported Matches",
      value: String(matchRows.length),
      delta: "Saved in Supabase",
      sentiment: "positive",
      progress: clamp(matchRows.length * 5),
    },
    {
      label: "Last Import",
      value: latestImport ? relativeTime(latestImport.imported_at) : "Never",
      delta: "Manual Riot sync",
      sentiment: latestImport ? "positive" : "neutral",
      progress: latestImport ? 100 : 0,
    },
  ];
}

export async function getLiveDashboardData(): Promise<DashboardData> {
  try {
    const supabase = await createClient();

    const [matchesResult, playerMatchesResult] = await Promise.all([
      supabase
        .from("riot_matches")
        .select("*")
        .order("game_start_time", { ascending: false })
        .limit(100),
      supabase
        .from("riot_player_matches")
        .select("*")
        .limit(500),
    ]);

    if (matchesResult.error) {
      throw new Error(matchesResult.error.message);
    }

    if (playerMatchesResult.error) {
      throw new Error(playerMatchesResult.error.message);
    }

    const matchRows = matchesResult.data ?? [];
    const playerRows = playerMatchesResult.data ?? [];

    if (!matchRows.length || !playerRows.length) {
      return {
        players: buildPlayers([]),
        matches: [],
        teamMetrics: buildMetrics([], []),
        dataStatus: "empty",
        dataMessage:
          "No imported games are available yet. Use Admin > Riot status > Import latest matches.",
      };
    }

    return {
      players: buildPlayers(playerRows),
      matches: buildMatches(playerRows, matchRows),
      teamMetrics: buildMetrics(playerRows, matchRows),
      dataStatus: "live",
      dataMessage:
        "Player cards, roster statistics, team metrics, and recent games are calculated from imported Match-v5 records. Coaching diagnosis and the gold chart remain manual.",
    };
  } catch (error) {
    console.error("Live Riot dashboard load failed:", error);

    return {
      players: buildPlayers([]),
      matches: [],
      teamMetrics: buildMetrics([], []),
      dataStatus: "error",
      dataMessage:
        "Live Riot records could not be loaded. Placeholder player and match statistics are not being shown.",
    };
  }
}