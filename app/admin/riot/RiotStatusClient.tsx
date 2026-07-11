"use client";

import { useActionState } from "react";
import {
  importRiotMatches,
  testRiotConnection,
} from "@/app/admin/actions";
import type {
  RiotImportResult,
  RiotPlayerStatus,
} from "@/lib/riot/types";

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
  const [statuses, testAction, testing] = useActionState<
    RiotPlayerStatus[] | null,
    FormData
  >(testRiotConnection, null);

  const [importResult, importAction, importing] = useActionState<
    RiotImportResult | null,
    FormData
  >(importRiotMatches, null);

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

          <div className="top-actions">
            <form action={testAction}>
              <button
                className="secondary-button"
                type="submit"
                disabled={testing || importing || !keyConfigured}
              >
                {testing ? "Testing..." : "Test connection"}
              </button>
            </form>

            <form action={importAction}>
              <button
                className="primary-button"
                type="submit"
                disabled={testing || importing || !keyConfigured}
              >
                {importing ? "Importing..." : "Import latest matches"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {importResult ? (
        <section className="panel">
          <div className="notice success-notice">
            Import complete: {importResult.imported} imported,{" "}
            {importResult.skipped} already saved, {importResult.failed} failed.
          </div>
          <p className="muted">
            {importResult.playersResolved} players resolved,{" "}
            {importResult.playersFailed} player lookups failed,{" "}
            {importResult.matchesFound} unique recent matches found.
          </p>

          {importResult.errors.length ? (
            <div className="status-error">
              <strong>Import details</strong>
              <ul>
                {importResult.errors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {statuses === null ? (
        <section className="panel riot-empty-state">
          <p className="muted">
            No connection test has been run. Use Import latest matches to save
            the roster&apos;s recent games, or Test connection for a read-only
            check.
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