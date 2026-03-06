"use client";

import { useCallback } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Note } from "@/lib/db";
import type { User } from "@/lib/auth";

interface Props {
  note: Note;
  user: User | null;
}

export default function NoteDetail({ note, user }: Props) {
  const handleDelete = useCallback(async () => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    const res = await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
    if (res.ok) {
      window.location.href = "/";
    }
  }, [note.id]);

  return (
    <>
      <div className="accent-bar" />
      <div className="app">
        <div className="note-detail">
          <a href="/" className="back-link">
            &larr; Back
          </a>

          <div className="note-detail-header">
            <h1 className="note-detail-title">{note.title}</h1>
            <div className="note-detail-meta">
              <span>{note.author || "Unknown"}</span>
              <span>{note.created_at.slice(0, 10)}</span>
            </div>
          </div>

          {note.cover_url && (
            <div className="note-detail-cover">
              <img src={note.cover_url} alt={note.title} />
            </div>
          )}

          <div className="markdown-body">
            <Markdown remarkPlugins={[remarkGfm]}>{note.content}</Markdown>
          </div>

          {user?.isAdmin && (
            <div className="editor-actions">
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
              <a href={`/edit/${note.id}`} className="btn btn-accent">
                Edit
              </a>
            </div>
          )}
        </div>

        <footer className="footer">Zihui Notes &middot; Built with vinext</footer>
      </div>
    </>
  );
}
