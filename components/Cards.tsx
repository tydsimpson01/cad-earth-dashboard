import type { Composition, Goal, MatchReview, Player, TeamMetric } from "@/types/dashboard";

export function MetricCard({ metric }: { metric: TeamMetric }) {
  return <article className="metric-card"><span>{metric.label}</span><strong>{metric.value}</strong><small className={metric.sentiment}>{metric.delta}</small><div className="sparkline"><i style={{ width: `${metric.progress}%` }} /></div></article>;
}

export function PlayerCard({ player }: { player: Player }) {
  return <article className="player-card"><div className="player-head"><div><span className="player-role">{player.role}</span><div className="player-id">{player.id}</div></div><strong>{player.rank}</strong></div><div className="stat-strip"><div className="mini-stat"><strong>{player.winRate}</strong><span>WIN RATE</span></div><div className="mini-stat"><strong>{player.kda}</strong><span>KDA</span></div><div className="mini-stat"><strong>{player.csPerMinute}</strong><span>CS / MIN</span></div><div className="mini-stat"><strong>{player.killParticipation}</strong><span>AVG K+A</span></div></div><p><span className="eyebrow">CHAMPION POOL</span></p><div className="champions">{player.champions.map((champion) => <span className="champion-pill" key={champion}>{champion}</span>)}</div><div className="coach-callout"><span className="callout-icon">âœ“</span><p><b>Current goal:</b> {player.goal}</p></div></article>;
}

export function MatchCard({ match }: { match: MatchReview }) {
  const sentiment = match.result === "Victory" ? "positive" : "negative";
  return <article className="match-card"><div className="match-meta"><span className={sentiment}>{match.result}</span><span>{match.when}</span></div><h3>{match.composition}</h3><p>{match.notes}</p><div className="match-meta"><span>{match.duration}</span><span>{match.score}</span></div><div className="tag-row">{match.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></article>;
}

export function CompositionCard({ composition }: { composition: Composition }) {
  return <article className="composition-card"><div className="composition-meta"><span>{composition.type}</span><span>Saved draft</span></div><h3>{composition.name}</h3><div className="champions">{composition.picks.map((pick) => <span className="champion-pill" key={pick}>{pick}</span>)}</div><div className="rating-grid"><div><strong>{composition.ratings.engage}/10</strong><span>ENGAGE</span></div><div><strong>{composition.ratings.peel}/10</strong><span>PEEL</span></div><div><strong>{composition.ratings.scaling}/10</strong><span>SCALING</span></div><div><strong>{composition.ratings.balance}/10</strong><span>BALANCE</span></div></div></article>;
}

export function GoalCard({ goal }: { goal: Goal }) {
  return <article className="goal-card"><span className="player-role">{goal.role}</span><h3>{goal.playerId}</h3><p>{goal.description}</p><div className="progress"><i style={{ width: `${goal.progress}%` }} /></div><small>{goal.progress}% toward weekly target</small></article>;
}
