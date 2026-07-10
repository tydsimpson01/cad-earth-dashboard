"use client";

import { FormEvent, useEffect, useState } from "react";
import { localCoachNotesStorage } from "@/lib/coach-notes-storage";
import type { CoachNote } from "@/types/dashboard";

export function CoachNotes() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [notes, setNotes] = useState<CoachNote[]>([]);

  useEffect(() => setNotes(localCoachNotesStorage.list()), []);

  function saveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !body.trim()) {
      window.alert("Add both a title and note body.");
      return;
    }
    setNotes(localCoachNotesStorage.save({ title: title.trim(), body: body.trim() }));
    setTitle("");
    setBody("");
  }

  return <><article className="panel note-editor"><form onSubmit={saveNote}><label htmlFor="note-title">Title</label><input id="note-title" value={title} onChange={(event: { target: { value: string } }) => setTitle(event.target.value)} placeholder="Example: Scrim review — July 12" /><label htmlFor="note-body">Notes</label><textarea id="note-body" rows={10} value={body} onChange={(event: { target: { value: string } }) => setBody(event.target.value)} placeholder="Draft, objective setup, communication, player feedback..." /><div className="note-actions"><button className="primary-button" type="submit">Save note locally</button><button className="secondary-button" type="button" onClick={() => { setTitle(""); setBody(""); }}>Clear</button></div></form></article><div id="saved-notes" className="saved-notes">{notes.length ? notes.map((note) => <article className="saved-note" key={note.id}><h4>{note.title}</h4><small>{note.date}</small><p>{note.body}</p></article>) : <div className="notice">No local notes saved yet.</div>}</div></>;
}
