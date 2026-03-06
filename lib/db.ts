import type { D1Database } from "@cloudflare/workers-types";

export interface Note {
  id: number;
  content: string;
  reference: string;
  created_at: string;
}

export interface Session {
  id: string;
  github_id: number;
  github_login: string;
  created_at: string;
  expires_at: string;
}

// Notes
export async function getNotes(db: D1Database): Promise<Note[]> {
  const { results } = await db
    .prepare("SELECT * FROM notes ORDER BY created_at DESC")
    .all<Note>();
  return results ?? [];
}

export async function createNote(
  db: D1Database,
  note: { content: string; reference: string }
): Promise<number> {
  const result = await db
    .prepare("INSERT INTO notes (content, reference) VALUES (?, ?)")
    .bind(note.content, note.reference)
    .run();
  return result.meta.last_row_id as number;
}

export async function deleteNote(db: D1Database, id: number): Promise<void> {
  await db.prepare("DELETE FROM notes WHERE id = ?").bind(id).run();
}

// Sessions
export async function createSession(
  db: D1Database,
  session: { id: string; github_id: number; github_login: string; expires_at: string }
): Promise<void> {
  await db
    .prepare(
      "INSERT INTO sessions (id, github_id, github_login, expires_at) VALUES (?, ?, ?, ?)"
    )
    .bind(session.id, session.github_id, session.github_login, session.expires_at)
    .run();
}

export async function getSession(
  db: D1Database,
  id: string
): Promise<Session | null> {
  return db
    .prepare("SELECT * FROM sessions WHERE id = ? AND expires_at > datetime('now')")
    .bind(id)
    .first<Session>();
}

export async function deleteSession(db: D1Database, id: string): Promise<void> {
  await db.prepare("DELETE FROM sessions WHERE id = ?").bind(id).run();
}
