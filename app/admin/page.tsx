import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteCoachNote, deleteComposition, deleteGoal, logout, saveCoachNote, saveComposition, saveGoal } from "@/app/admin/actions";
import type { Json } from "@/types/database";

type RatingKey = "engage" | "peel" | "scaling" | "balance";

function readRating(ratings: Json, key: RatingKey) {
  if (!ratings || typeof ratings !== "object" || Array.isArray(ratings)) return 0;
  const value = ratings[key];
  return typeof value === "number" ? value : 0;
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const { error, success } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError || isAdmin !== true) redirect("/login?error=Admin%20access%20required");
  const [{ data: notes }, { data: goals }, { data: compositions }] = await Promise.all([
    supabase.from("coach_notes").select("*").order("created_at", { ascending: false }),
    supabase.from("player_goals").select("*").order("created_at", { ascending: false }),
    supabase.from("compositions").select("*").order("created_at", { ascending: false })
  ]);

  return <div className="admin-shell"><header className="admin-header"><div><p className="eyebrow">ADMIN</p><h1>Coach editing</h1><p className="muted">Signed in as {user.email}. Public dashboard remains readable.</p></div><div className="top-actions"><Link className="secondary-button" href="/admin/riot">Riot status</Link><Link className="secondary-button" href="/">Public dashboard</Link><form action={logout}><button className="secondary-button" type="submit">Log out</button></form></div></header>{error ? <div className="notice negative-notice">{error}</div> : null}{success ? <div className="notice success-notice">{success}</div> : null}<section className="admin-grid"><article className="panel"><h2>Coach notes</h2><form action={saveCoachNote} className="stacked-form"><label>Title<input name="title" required /></label><label>Body<textarea name="body" rows={5} required /></label><button className="primary-button" type="submit">Create note</button></form><div className="admin-list">{notes?.map((note) => <form action={saveCoachNote} className="admin-item" key={note.id}><input type="hidden" name="id" value={note.id} /><input name="title" defaultValue={note.title} /><textarea name="body" defaultValue={note.body} rows={4} /><div className="note-actions"><button className="primary-button" type="submit">Save</button><button className="secondary-button" formAction={deleteCoachNote}>Delete</button></div></form>)}</div></article><article className="panel"><h2>Weekly goals</h2><form action={saveGoal} className="stacked-form"><label>Player ID<input name="player_id" required /></label><label>Role<input name="role" required /></label><label>Description<input name="description" required /></label><label>Progress<input name="progress" type="number" min="0" max="100" defaultValue="0" /></label><button className="primary-button" type="submit">Create goal</button></form><div className="admin-list">{goals?.map((goal) => <form action={saveGoal} className="admin-item" key={goal.id}><input type="hidden" name="id" value={goal.id} /><input name="player_id" defaultValue={goal.player_id} /><input name="role" defaultValue={goal.role} /><input name="description" defaultValue={goal.description} /><input name="progress" type="number" min="0" max="100" defaultValue={goal.progress} /><div className="note-actions"><button className="primary-button" type="submit">Save</button><button className="secondary-button" formAction={deleteGoal}>Delete</button></div></form>)}</div></article><article className="panel"><h2>Saved compositions</h2><form action={saveComposition} className="stacked-form"><label>Name<input name="name" required /></label><label>Type<input name="type" required /></label><label>Picks<input name="picks" placeholder="Ornn, Vi, Orianna, Jinx, Milio" required /></label><div className="rating-grid"><label>Engage<input name="engage" type="number" min="0" max="10" defaultValue="0" /></label><label>Peel<input name="peel" type="number" min="0" max="10" defaultValue="0" /></label><label>Scaling<input name="scaling" type="number" min="0" max="10" defaultValue="0" /></label><label>Balance<input name="balance" type="number" min="0" max="10" defaultValue="0" /></label></div><button className="primary-button" type="submit">Create composition</button></form><div className="admin-list">{compositions?.map((composition) => <form action={saveComposition} className="admin-item" key={composition.id}><input type="hidden" name="id" value={composition.id} /><input name="name" defaultValue={composition.name} /><input name="type" defaultValue={composition.type} /><input name="picks" defaultValue={composition.picks.join(", ")} /><input name="engage" type="number" min="0" max="10" defaultValue={readRating(composition.ratings, "engage")} /><input name="peel" type="number" min="0" max="10" defaultValue={readRating(composition.ratings, "peel")} /><input name="scaling" type="number" min="0" max="10" defaultValue={readRating(composition.ratings, "scaling")} /><input name="balance" type="number" min="0" max="10" defaultValue={readRating(composition.ratings, "balance")} /><div className="note-actions"><button className="primary-button" type="submit">Save</button><button className="secondary-button" formAction={deleteComposition}>Delete</button></div></form>)}</div></article></section></div>;
}
