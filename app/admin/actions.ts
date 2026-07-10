"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || isAdmin !== true) redirect("/login?error=Admin%20access%20required");
  return { supabase, user };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function saveCoachNote(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!title || !body) return;
  if (id) await supabase.from("coach_notes").update({ title, body }).eq("id", id);
  else await supabase.from("coach_notes").insert({ title, body, created_by: user.id });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteCoachNote(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("coach_notes").delete().eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveGoal(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const payload = { player_id: String(formData.get("player_id") ?? ""), role: String(formData.get("role") ?? ""), description: String(formData.get("description") ?? ""), progress: Number(formData.get("progress") ?? 0), created_by: user.id };
  if (id) await supabase.from("player_goals").update(payload).eq("id", id);
  else await supabase.from("player_goals").insert(payload);
  revalidatePath("/admin");
}

export async function deleteGoal(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("player_goals").delete().eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/admin");
}

export async function saveComposition(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const payload = { name: String(formData.get("name") ?? ""), type: String(formData.get("type") ?? ""), picks: String(formData.get("picks") ?? "").split(",").map((pick) => pick.trim()).filter(Boolean), ratings: { engage: Number(formData.get("engage") ?? 0), peel: Number(formData.get("peel") ?? 0), scaling: Number(formData.get("scaling") ?? 0), balance: Number(formData.get("balance") ?? 0) }, created_by: user.id };
  if (id) await supabase.from("compositions").update(payload).eq("id", id);
  else await supabase.from("compositions").insert(payload);
  revalidatePath("/admin");
}

export async function deleteComposition(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("compositions").delete().eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/admin");
}
