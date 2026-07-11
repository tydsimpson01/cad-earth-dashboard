export type Role = "TOP" | "JUNGLE" | "MID" | "BOT" | "SUPPORT";

export interface Player {
  id: string;
  name: string;
  role: Role;
  rank: string;
  winRate: string;
  kda: string;
  csPerMinute: string;
  killParticipation: string;
  goal: string;
  champions: string[];
}

export interface MatchReview {
  result: "Victory" | "Defeat";
  score: string;
  duration: string;
  when: string;
  composition: string;
  notes: string;
  tags: string[];
}

export interface Composition {
  name: string;
  type: string;
  picks: string[];
  ratings: {
    engage: number;
    peel: number;
    scaling: number;
    balance: number;
  };
}

export interface Goal {
  playerId: string;
  role: Role;
  description: string;
  progress: number;
}

export interface TeamMetric {
  label: string;
  value: string;
  delta: string;
  sentiment: "positive" | "negative" | "neutral";
  progress: number;
}

export interface CoachNote {
  id: string;
  title: string;
  body: string;
  date: string;
}
export type DashboardDataStatus = "live" | "empty" | "error";

export interface DashboardData {
  players: Player[];
  matches: MatchReview[];
  teamMetrics: TeamMetric[];
  dataStatus: DashboardDataStatus;
  dataMessage: string;
}