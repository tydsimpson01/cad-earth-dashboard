import type { Composition, Goal, MatchReview, Player, TeamMetric } from "@/types/dashboard";

export const players: Player[] = [
  { id: "chico#3456", name: "chico", role: "TOP", rank: "Gold II", winRate: "60%", kda: "2.9", csPerMinute: "7.2", killParticipation: "65%", goal: "CS ≥ 8/min", champions: ["Ornn", "Gnar", "Malphite"] },
  { id: "Aigis#SEES", name: "Aigis", role: "JUNGLE", rank: "Gold III", winRate: "55%", kda: "3.4", csPerMinute: "5.1", killParticipation: "72%", goal: "Earlier objective setup", champions: ["Vi", "Nocturne", "Jarvan IV"] },
  { id: "Nemoupi#2427", name: "Nemoupi", role: "MID", rank: "Platinum IV", winRate: "65%", kda: "3.6", csPerMinute: "7.6", killParticipation: "68%", goal: "Roam on first reset", champions: ["Ahri", "Orianna", "Viktor"] },
  { id: "redakted#GONE", name: "redakted", role: "BOT", rank: "Gold II", winRate: "60%", kda: "3.2", csPerMinute: "8.1", killParticipation: "63%", goal: "Fewer late deaths", champions: ["Jinx", "Kai'Sa", "Ezreal"] },
  { id: "Rylionn#NA1", name: "Rylionn", role: "SUPPORT", rank: "Gold III", winRate: "55%", kda: "3.8", csPerMinute: "1.2", killParticipation: "74%", goal: "Vision before dragon", champions: ["Nautilus", "Rakan", "Milio"] }
];

export const teamMetrics: TeamMetric[] = [
  { label: "Win Rate", value: "60%", delta: "12W – 8L", sentiment: "positive", progress: 72 },
  { label: "Avg. Game", value: "28:34", delta: "-1:12 vs prior 20", sentiment: "positive", progress: 58 },
  { label: "First Blood", value: "65%", delta: "+12%", sentiment: "positive", progress: 65 },
  { label: "First Dragon", value: "60%", delta: "+8%", sentiment: "positive", progress: 60 },
  { label: "Dragon Control", value: "58%", delta: "+9%", sentiment: "positive", progress: 58 },
  { label: "Baron Control", value: "55%", delta: "+10%", sentiment: "positive", progress: 55 }
];

export const matches: MatchReview[] = [
  { result: "Victory", score: "18 / 6 / 24", duration: "32:14", when: "24 hours ago", composition: "Front-to-back", notes: "Strong second dragon setup and clean Baron conversion.", tags: ["Good draft", "Objective control"] },
  { result: "Defeat", score: "8 / 12 / 10", duration: "28:09", when: "2 days ago", composition: "Pick composition", notes: "Two deaths before third dragon removed contest options.", tags: ["Pre-dragon deaths", "Late reset"] },
  { result: "Victory", score: "22 / 9 / 28", duration: "35:42", when: "4 days ago", composition: "Wombo engage", notes: "Clear engage windows and disciplined side waves.", tags: ["Teamfight win", "Strong comms"] },
  { result: "Defeat", score: "5 / 11 / 7", duration: "26:11", when: "5 days ago", composition: "Scaling", notes: "Drafted for late game, then fought every early neutral objective anyway.", tags: ["Win-condition error", "Forced fights"] }
];

export const compositions: Composition[] = [
  { name: "Earthquake", type: "Front-to-back", picks: ["Ornn", "Vi", "Orianna", "Jinx", "Milio"], ratings: { engage: 9, peel: 8, scaling: 9, balance: 8 } },
  { name: "Hard Reset", type: "Pick / dive", picks: ["Gnar", "Nocturne", "Ahri", "Kai'Sa", "Nautilus"], ratings: { engage: 9, peel: 5, scaling: 7, balance: 8 } },
  { name: "Safe Mode", type: "Control / scaling", picks: ["Malphite", "Jarvan IV", "Viktor", "Ezreal", "Rakan"], ratings: { engage: 8, peel: 7, scaling: 8, balance: 7 } }
];

export const goals: Goal[] = players.map((player, index) => ({
  playerId: player.id,
  role: player.role,
  description: player.goal,
  progress: [72, 58, 66, 61, 70][index]
}));
