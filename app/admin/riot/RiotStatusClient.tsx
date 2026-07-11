"use client";

import { useActionState } from "react";
import { testRiotConnection } from "@/app/admin/actions";
import type { RiotPlayerStatus } from "@/lib/riot/types";

type RiotStatusClientProps = {
  routingRegion: string;
  matchCount: number;
  keyConfigured: boolean;
};

export default function RiotStatusClient({
  routingRegion,
  matchCount,
  keyConfigured,
}: RiotStatusClientProps) {
  const [statuses, formAction, pending] = useActionState<
    RiotPlayerStatus[] | null,
    FormData
  >(testRiotConnection, null);

  return (
    <>
      <section className="panel">
        <div className="riot-toolbar">
          <div className="riot-config">
            <span>
              <strong>Routing region:</strong> {routingRegion}
            </span>
            <span>
              <strong>Recent matches per player:</strong> {matchCount}
            </span>
            <span>
              <strong>Server key:</strong>{" "}
              {keyConfigured ? "Configured" : "Missing RIOT_API_KEY"}
            </span>
          </div>

          <form action={formAction}>
            <button
              className="primary-button"
              type="submit"
              disabled={pending}
            >
              {pending ? "Testing..." : "Test Riot connection"}
            </button>
          </form>
        </div>
      </section>

      {statuses === null ? (
        <section className="panel riot-empty-state">
          <p className="muted">
            No Riot requests have been made yet. Click the button once to run
            the roster check.
          </p>
        </section>
      ) : (
        <>
          <div className="notice success-notice">
            Riot connection tested:{" "}
            {statuses.filter((status) => status.ok).length} resolved,{" "}
            {statuses.filter((status) => !status.ok).length} failed.
          </div>

          <section className="admin-grid riot-status-grid">
            {statuses.map((status) => (
              <article className="panel" key={status.player.riotId}>
                <p className="eyebrow">{status.player.role}</p>
                <h2>{status.player.riotId}</h2>

                {status.ok ? (
                  <div className="status-ok">
                    <strong>Resolved</strong>
                    <p>
                      PUUID: <code>{status.account.puuid}</code>
                    </p>
                    <p>
                      Recent match details checked: {status.matchesChecked}
                    </p>

                    {status.matchIds.length ? (
                      <ul>
                        {status.matchIds.map((matchId) => (
                          <li key={matchId}>
                            <code>{matchId}</code>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No recent matches returned by Riot.</p>
                    )}
                  </div>
                ) : (
                  <div className="status-error">
                    <strong>{status.error.code}</strong>
                    <p>{status.error.message}</p>
                    {status.error.status ? (
                      <p>HTTP status: {status.error.status}</p>
                    ) : null}
                    {status.error.retryAfter ? (
                      <p>Retry after: {status.error.retryAfter}</p>
                    ) : null}
                  </div>
                )}
              </article>
            ))}
          </section>
        </>
      )}
    </>
  );
}
