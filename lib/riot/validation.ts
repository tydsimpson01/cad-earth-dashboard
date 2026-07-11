import type {
  RiotAccount,
  RiotMatchParticipant,
  RiotMatchSummary,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function numberOrZero(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function validateRiotAccount(value: unknown): RiotAccount {
  if (
    !isRecord(value) ||
    typeof value.puuid !== "string" ||
    typeof value.gameName !== "string" ||
    typeof value.tagLine !== "string"
  ) {
    throw new Error(
      "Riot Account-v1 response did not match the expected shape.",
    );
  }

  return {
    puuid: value.puuid,
    gameName: value.gameName,
    tagLine: value.tagLine,
  };
}

export function validateMatchIdList(value: unknown): string[] {
  if (
    !Array.isArray(value) ||
    !value.every((item) => typeof item === "string")
  ) {
    throw new Error(
      "Riot Match-v5 match ID response did not match the expected shape.",
    );
  }

  return value;
}

function validateParticipant(value: unknown): RiotMatchParticipant {
  if (
    !isRecord(value) ||
    typeof value.puuid !== "string" ||
    typeof value.championName !== "string" ||
    typeof value.kills !== "number" ||
    typeof value.deaths !== "number" ||
    typeof value.assists !== "number" ||
    typeof value.win !== "boolean"
  ) {
    throw new Error("Riot Match-v5 participant response is invalid.");
  }

  return {
    puuid: value.puuid,
    riotIdGameName: optionalString(value.riotIdGameName),
    riotIdTagline: optionalString(value.riotIdTagline),
    participantId: numberOrZero(value.participantId),
    teamId: numberOrZero(value.teamId),
    championId: numberOrZero(value.championId),
    championName: value.championName,
    teamPosition: optionalString(value.teamPosition) ?? "",
    kills: value.kills,
    deaths: value.deaths,
    assists: value.assists,
    totalMinionsKilled: numberOrZero(value.totalMinionsKilled),
    neutralMinionsKilled: numberOrZero(value.neutralMinionsKilled),
    goldEarned: numberOrZero(value.goldEarned),
    visionScore: numberOrZero(value.visionScore),
    totalDamageDealtToChampions: numberOrZero(
      value.totalDamageDealtToChampions,
    ),
    damageDealtToObjectives: numberOrZero(value.damageDealtToObjectives),
    timePlayed: numberOrZero(value.timePlayed),
    win: value.win,
  };
}

export function validateRiotMatch(value: unknown): RiotMatchSummary {
  if (
    !isRecord(value) ||
    !isRecord(value.metadata) ||
    !isRecord(value.info)
  ) {
    throw new Error(
      "Riot Match-v5 detail response did not match the expected shape.",
    );
  }

  const metadata = value.metadata;
  const info = value.info;

  if (
    typeof metadata.matchId !== "string" ||
    !Array.isArray(metadata.participants) ||
    !metadata.participants.every(
      (participant) => typeof participant === "string",
    )
  ) {
    throw new Error("Riot Match-v5 metadata response is invalid.");
  }

  if (
    typeof info.gameCreation !== "number" ||
    typeof info.gameDuration !== "number" ||
    typeof info.gameMode !== "string" ||
    typeof info.queueId !== "number" ||
    !Array.isArray(info.participants)
  ) {
    throw new Error("Riot Match-v5 info response is invalid.");
  }

  return {
    metadata: {
      matchId: metadata.matchId,
      participants: metadata.participants,
    },
    info: {
      gameCreation: info.gameCreation,
      gameStartTimestamp: optionalNumber(info.gameStartTimestamp),
      gameEndTimestamp: optionalNumber(info.gameEndTimestamp),
      gameDuration: info.gameDuration,
      gameMode: info.gameMode,
      gameType: optionalString(info.gameType),
      gameVersion: optionalString(info.gameVersion),
      queueId: info.queueId,
      participants: info.participants.map(validateParticipant),
    },
  };
}