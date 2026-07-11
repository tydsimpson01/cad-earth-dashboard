export type RiotRosterPlayer = {
  role: string;
  riotId: string;
  gameName: string;
  tagLine: string;
};

export type RiotAccount = {
  puuid: string;
  gameName: string;
  tagLine: string;
};

export type RiotMatchParticipant = {
  puuid: string;
  riotIdGameName?: string;
  riotIdTagline?: string;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
};

export type RiotMatchSummary = {
  metadata: {
    matchId: string;
    participants: string[];
  };
  info: {
    gameCreation: number;
    gameDuration: number;
    gameMode: string;
    queueId: number;
    participants: RiotMatchParticipant[];
  };
};

export type RiotMappedError = {
  code:
    | "missing_key"
    | "unauthorized"
    | "rate_limited"
    | "not_found"
    | "outage"
    | "invalid_response"
    | "network"
    | "unknown";
  message: string;
  status?: number;
  retryAfter?: string | null;
};

export type RiotPlayerStatus =
  | {
      player: RiotRosterPlayer;
      ok: true;
      account: RiotAccount;
      matchIds: string[];
      matches: RiotMatchSummary[];
      matchesChecked: number;
    }
  | {
      player: RiotRosterPlayer;
      ok: false;
      error: RiotMappedError;
    };
