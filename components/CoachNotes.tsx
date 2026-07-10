"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { CoachNote } from "@/types/dashboard";

type CoachNoteRow = { id: string; title: string; body: string; created_at: string };

function toCoachNote(row: CoachNoteRow): CoachNote {
  return { id: row.id, title: row.title, body: row.body, date: new Date(row.created_at).toLocaleString() };
}

export function CoachNotes() {
  const [notes, setNotes] = useState<CoachNote[]>([]);
  const [status, setStatus] = useState("Loading coach notes...");

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      setStatus("Supabase is not configured yet. Public dashboard data remains available; coach notes will load after setup.");
      return;
    }

    const supabase = createClient();
    supabase.from("coach_notes").select("id,title,body,created_at").order("created_at", { ascending: false }).then(({ data, error }) => {
      if (error) {
        setStatus("Coach notes could not be loaded.");
        return;
      }
      setNotes((data ?? []).map(toCoachNote));
      setStatus((data ?? []).length ? "" : "No coach notes saved yet.");
    });
  }, []);

  return <><div className="notice"><strong>Admin protected:</strong> notes are stored in Supabase. Coaches can create, edit, or delete notes from the admin area.</div><div id="saved-notes" className="saved-notes">{notes.length ? notes.map((note) => <article className="saved-note" key={note.id}><h4>{note.title}</h4><small>{note.date}</small><p>{note.body}</p></article>) : <div className="notice">{status}</div>}</div></>;
}
