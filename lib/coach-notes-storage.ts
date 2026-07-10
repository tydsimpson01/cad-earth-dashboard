import type { CoachNote } from "@/types/dashboard";

export interface CoachNotesStorage {
  list(): CoachNote[];
  save(note: Omit<CoachNote, "id" | "date">): CoachNote[];
  clearDraft(): void;
}

const STORAGE_KEY = "cadEarthNotes";

function readNotes(): CoachNote[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CoachNote[]) : [];
  } catch {
    return [];
  }
}

function writeNotes(notes: CoachNote[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export const localCoachNotesStorage: CoachNotesStorage = {
  list: readNotes,
  save(note) {
    const notes = readNotes();
    const nextNotes = [
      {
        id: crypto.randomUUID(),
        title: note.title,
        body: note.body,
        date: new Date().toLocaleString()
      },
      ...notes
    ];
    writeNotes(nextNotes);
    return nextNotes;
  },
  clearDraft() {
    return undefined;
  }
};
