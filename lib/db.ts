import type { D1Database } from "@cloudflare/workers-types";

export interface Note {
  id: number;
  title: string;
  author: string;
  content: string;
  cover_url: string;
  created_at: string;
  updated_at: string;
}

export interface Recommendation {
  id: number;
  title: string;
  author: string;
  category: string;
  description: string;
  tags: string;
  cover_url: string;
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

export async function getNoteById(
  db: D1Database,
  id: number
): Promise<Note | null> {
  return db.prepare("SELECT * FROM notes WHERE id = ?").bind(id).first<Note>();
}

export async function createNote(
  db: D1Database,
  note: { title: string; author: string; content: string; cover_url: string }
): Promise<number> {
  const result = await db
    .prepare(
      "INSERT INTO notes (title, author, content, cover_url) VALUES (?, ?, ?, ?)"
    )
    .bind(note.title, note.author, note.content, note.cover_url)
    .run();
  return result.meta.last_row_id as number;
}

export async function updateNote(
  db: D1Database,
  id: number,
  note: { title: string; author: string; content: string; cover_url: string }
): Promise<void> {
  await db
    .prepare(
      "UPDATE notes SET title = ?, author = ?, content = ?, cover_url = ?, updated_at = datetime('now') WHERE id = ?"
    )
    .bind(note.title, note.author, note.content, note.cover_url, id)
    .run();
}

export async function deleteNote(
  db: D1Database,
  id: number
): Promise<void> {
  await db.prepare("DELETE FROM notes WHERE id = ?").bind(id).run();
}

// Recommendations
export async function getRecommendations(
  db: D1Database,
  category?: string
): Promise<Recommendation[]> {
  if (category) {
    const { results } = await db
      .prepare("SELECT * FROM recommendations WHERE category = ? ORDER BY id")
      .bind(category)
      .all<Recommendation>();
    return results ?? [];
  }
  const { results } = await db
    .prepare("SELECT * FROM recommendations ORDER BY id")
    .all<Recommendation>();
  return results ?? [];
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
  const session = await db
    .prepare("SELECT * FROM sessions WHERE id = ? AND expires_at > datetime('now')")
    .bind(id)
    .first<Session>();
  return session;
}

export async function deleteSession(
  db: D1Database,
  id: string
): Promise<void> {
  await db.prepare("DELETE FROM sessions WHERE id = ?").bind(id).run();
}
