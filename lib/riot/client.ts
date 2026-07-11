import "server-only";
import { mapRiotStatus, toRiotError } from "./errors";
import { RIOT_ROSTER } from "./roster";
import type {
  RiotAccount,
  RiotMappedError,
  RiotMatchSummary,
  RiotPlayerStatus,
} from "./types";
import {
  validateMatchIdList,
  validateRiotAccount,
  validateRiotMatch,
} from "./validation";

const DEFAULT_ROUTING_REGION = "americas";
const DEFAULT_MATCH_COUNT = 3;
const MAX_MATCH_COUNT = 5;

export function riotConfig() {
  const configuredCount = Number.parseInt(
    process.env.RIOT_RECENT_MATCH_COUNT ?? "",
    10,
  );

  const matchCount = Number.isFinite(configuredCount)
    ? Math.max(1, Math.min(configuredCount, MAX_MATCH_COUNT))
    : DEFAULT_MATCH_COUNT;

  return {
    apiKey: process.env.RIOT_API_KEY,
    routingRegion:
      process.env.RIOT_ROUTING_REGION ??
      process.env.RIOT_REGION ??
      DEFAULT_ROUTING_REGION,
    matchCount,
  };
}

async function riotFetch(path: string): Promise<unknown> {
  const { apiKey, routingRegion } = riotConfig();

  if (!apiKey) {
    throw {
      code: "missing_key",
      message: "RIOT_API_KEY is not configured on the server.",
    } satisfies RiotMappedError;
  }

  const response = await fetch(
    `https://${routingRegion}.api.riotgames.com${path}`,
    {
      headers: {
        "X-Riot-Token": apiKey,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw mapRiotStatus(
      response.status,
      response.headers.get("retry-after"),
    );
  }

  return response.json();
}

export async function getAccountByRiotId(
  gameName: string,
  tagLine: string,
): Promise<RiotAccount> {
  const payload = await riotFetch(
    `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
      gameName,
    )}/${encodeURIComponent(tagLine)}`,
  );

  return validateRiotAccount(payload);
}

export async function getRecentMatchIds(
  puuid: string,
  count = riotConfig().matchCount,
): Promise<string[]> {
  const limitedCount = Math.max(1, Math.min(count, MAX_MATCH_COUNT));
  const payload = await riotFetch(
    `/lol/match/v5/matches/by-puuid/${encodeURIComponent(
      puuid,
    )}/ids?start=0&count=${limitedCount}`,
  );

  return validateMatchIdList(payload);
}

export async function getMatch(matchId: string): Promise<RiotMatchSummary> {
  const payload = await riotFetch(
    `/lol/match/v5/matches/${encodeURIComponent(matchId)}`,
  );

  return validateRiotMatch(payload);
}

export async function getRosterStatus(): Promise<RiotPlayerStatus[]> {
  return Promise.all(
    RIOT_ROSTER.map(async (player): Promise<RiotPlayerStatus> => {
      try {
        const account = await getAccountByRiotId(
          player.gameName,
          player.tagLine,
        );
        const matchIds = await getRecentMatchIds(account.puuid);
        const matches = await Promise.all(
          matchIds.slice(0, 1).map((matchId) => getMatch(matchId)),
        );

        return {
          player,
          ok: true,
          account,
          matchIds,
          matches,
          matchesChecked: matches.length,
        };
      } catch (error) {
        return {
          player,
          ok: false,
          error: toRiotError(error),
        };
      }
    }),
  );
}
