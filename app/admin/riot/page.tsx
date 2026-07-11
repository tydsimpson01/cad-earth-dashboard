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
          <h1>Riot match import</h1>
          <p className="muted">
            Pull the roster&apos;s latest Match-v5 games and save new matches
            and player statistics to Supabase.
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