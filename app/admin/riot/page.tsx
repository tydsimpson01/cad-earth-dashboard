import Link from "next/link";
import { redirect } from "next/navigation";
import RiotStatusClient from "./RiotStatusClient";
import { riotConfig } from "@/lib/riot/client";
import { createClient } from "@/lib/supabase/server";

export default async function RiotStatusPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || isAdmin !== true) {
    redirect("/login?error=Admin%20access%20required");
  }

  const config = riotConfig();

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">RIOT API</p>
          <h1>Roster connection status</h1>
          <p className="muted">
            Read-only server-side checks for Account-v1 and a small Match-v5
            sample. No Supabase data is overwritten.
          </p>
        </div>

        <div className="top-actions">
          <Link className="secondary-button" href="/admin">
            Admin
          </Link>
          <Link className="secondary-button" href="/">
            Public dashboard
          </Link>
        </div>
      </header>

      <RiotStatusClient
        routingRegion={config.routingRegion}
        matchCount={config.matchCount}
        keyConfigured={Boolean(config.apiKey)}
      />
    </div>
  );
}
