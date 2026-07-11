import type { RiotRosterPlayer } from "./types";

export const RIOT_ROSTER: RiotRosterPlayer[] = [
  {
    role: "Top",
    riotId: "chico#3456",
    gameName: "chico",
    tagLine: "3456",
  },
  {
    role: "Jungle",
    riotId: "Aigis#SEES",
    gameName: "Aigis",
    tagLine: "SEES",
  },
  {
    role: "Mid",
    riotId: "Nemoupi#2427",
    gameName: "Nemoupi",
    tagLine: "2427",
  },
  {
    role: "Bot",
    riotId: "redakted#GONE",
    gameName: "redakted",
    tagLine: "GONE",
  },
  {
    role: "Support",
    riotId: "Rylionn#NA1",
    gameName: "Rylionn",
    tagLine: "NA1",
  },
];

export function parseRiotId(value: string) {
  const trimmed = value.trim();
  const separator = trimmed.lastIndexOf("#");

  if (separator <= 0 || separator === trimmed.length - 1) return null;

  const gameName = trimmed.slice(0, separator).trim();
  const tagLine = trimmed.slice(separator + 1).trim();

  if (
    !gameName ||
    !tagLine ||
    gameName.includes("#") ||
    tagLine.includes("#")
  ) {
    return null;
  }

  return {
    gameName,
    tagLine,
    riotId: `${gameName}#${tagLine}`,
  };
}
