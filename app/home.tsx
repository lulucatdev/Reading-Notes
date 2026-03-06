"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { Note } from "@/lib/db";
import type { User } from "@/lib/auth";

interface Props {
  notes: Note[];
  user: User | null;
}

const GITHUB_SVG = (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

function isUrl(str: string): boolean {
  return /^https?:\/\//i.test(str.trim());
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr + "Z");
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

// Ink background
function useInkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let width = 0, height = 0, animId = 0;

    interface P { x: number; y: number; bx: number; by: number; s: number; a: number; d: number; p: number; }
    let particles: P[] = [];

    function resize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
      particles = [];
      const count = Math.floor((width * height) / 9000);
      for (let i = 0; i < count; i++) {
        const x = Math.random() * width, y = Math.random() * height;
        particles.push({ x, y, bx: x, by: y, s: Math.random() * 2 + 0.5, a: Math.random() * 0.08 + 0.03, d: Math.random() * 2 - 1, p: Math.random() * Math.PI * 2 });
      }
    }

    let t = 0;
    function animate() {
      ctx.clearRect(0, 0, width, height);
      t += 0.008;
      const mx = mouseRef.current.x, my = mouseRef.current.y, R = 200;
      for (const p of particles) {
        p.x = p.bx + Math.sin(t + p.p) * p.d * 15;
        p.y = p.by + Math.cos(t * 0.7 + p.p) * p.d * 8;
        const dx = p.x - mx, dy = p.y - my, dist = Math.sqrt(dx * dx + dy * dy);
        let px = p.x, py = p.y, pa = p.a, ps = p.s;
        if (dist < R) {
          const f = 1 - dist / R, ang = Math.atan2(dy, dx);
          px += Math.cos(ang) * f * 40;
          py += Math.sin(ang) * f * 40;
          pa += f * 0.2;
          ps += f * 2;
        }
        const edge = Math.min(px / 60, (width - px) / 60, py / 60, (height - py) / 60, 1);
        ctx.beginPath();
        ctx.arc(px, py, ps, 0, Math.PI * 2);
        if (dist < R) {
          const tt = 1 - dist / R;
          ctx.fillStyle = `rgba(${Math.round(146 + 97 * tt)}, ${Math.round(155 - 27 * tt)}, ${Math.round(176 - 144 * tt)}, ${pa * edge})`;
        } else {
          ctx.fillStyle = `rgba(146, 155, 176, ${pa * edge})`;
        }
        ctx.fill();
      }
      animId = requestAnimationFrame(animate);
    }

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (glowRef.current) { glowRef.current.style.left = e.clientX + "px"; glowRef.current.style.top = e.clientY + "px"; glowRef.current.classList.add("active"); }
    };
    const onLeave = () => { mouseRef.current = { x: -1000, y: -1000 }; glowRef.current?.classList.remove("active"); };

    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    resize();
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseleave", onLeave); };
  }, []);

  return { canvasRef, glowRef };
}

function QuickCapture({ onSaved }: { onSaved: () => void }) {
  const [content, setContent] = useState("");
  const [reference, setReference] = useState("");
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = useCallback(async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), reference: reference.trim() }),
      });
      setContent("");
      setReference("");
      onSaved();
    } catch {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [content, reference, onSaved]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSave();
      }
    },
    [handleSave]
  );

  return (
    <div className="capture-box">
      <textarea
        ref={textareaRef}
        className="capture-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What did you learn today?"
        rows={3}
      />
      <div className="capture-bottom">
        <input
          className="capture-ref"
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Reference — URL or source text (optional)"
        />
        <button
          className="btn btn-accent"
          onClick={handleSave}
          disabled={saving || !content.trim()}
        >
          {saving ? "Saving..." : "Save"}
          <span className="capture-shortcut">⌘↵</span>
        </button>
      </div>
    </div>
  );
}

function NoteItem({ note, isAdmin, onDeleted }: { note: Note; isAdmin: boolean; onDeleted: () => void }) {
  const handleDelete = useCallback(async () => {
    if (!confirm("Delete this note?")) return;
    await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
    onDeleted();
  }, [note.id, onDeleted]);

  return (
    <div className="note-item">
      <div className="note-content">{note.content}</div>
      {note.reference && (
        <div className="note-ref">
          {isUrl(note.reference) ? (
            <a href={note.reference} target="_blank" rel="noopener noreferrer" className="note-ref-link">
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              {note.reference.replace(/^https?:\/\//, "").split("/")[0]}
            </a>
          ) : (
            <span className="note-ref-text">— {note.reference}</span>
          )}
        </div>
      )}
      <div className="note-meta">
        <span className="note-time">{formatTime(note.created_at)}</span>
        {isAdmin && (
          <button className="note-delete" onClick={handleDelete}>delete</button>
        )}
      </div>
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <span className="footer-brand-dot" />
              <span className="footer-brand-name">Zihui Chen</span>
            </div>
            <p className="footer-brand-desc">
              Independent Researcher & Builder.
            </p>
          </div>
          <div>
            <div className="footer-heading">Projects</div>
            <div className="footer-links">
              <a href="https://zihuichen.com" target="_blank" rel="noopener noreferrer" className="footer-link">Homepage</a>
              <a href="https://vc.zihuichen.com" target="_blank" rel="noopener noreferrer" className="footer-link">VC Radar</a>
              <a href="https://notes.zihuichen.com" className="footer-link">Notes</a>
            </div>
          </div>
          <div>
            <div className="footer-heading">Links</div>
            <div className="footer-links">
              <a href="https://github.com/chenzihui222" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">&copy; {year} Zihui Chen</span>
          <a href="https://github.com/chenzihui222" target="_blank" rel="noopener noreferrer" className="footer-social">{GITHUB_SVG}</a>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage({ notes: initialNotes, user }: Props) {
  const { canvasRef, glowRef } = useInkBackground();
  const [notes, setNotes] = useState(initialNotes);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/notes");
    const data = (await res.json()) as { notes: Note[] };
    setNotes(data.notes);
  }, []);

  return (
    <>
      <div className="accent-bar" />
      <canvas id="ink-canvas" ref={canvasRef} />
      <div id="mouse-glow" ref={glowRef} />

      <div className="app">
        <nav className="nav anim-fade-up">
          <a href="/" className="nav-brand">
            <span className="nav-dot" />
            <span className="nav-title">Zihui Notes</span>
          </a>
          <div className="nav-links">
            <a href="https://zihuichen.com" target="_blank" rel="noopener noreferrer" className="nav-link">Home</a>
            <a href="https://vc.zihuichen.com" target="_blank" rel="noopener noreferrer" className="nav-link">VC Radar</a>
          </div>
          <div className="nav-actions">
            {user ? (
              <form action="/api/auth/logout" method="POST" style={{ display: "inline" }}>
                <button type="submit" className="btn btn-ghost">
                  <span className="user-badge">@{user.github_login}</span>
                  Logout
                </button>
              </form>
            ) : (
              <a href="/api/auth/login" className="btn">
                {GITHUB_SVG}
                Sign in
              </a>
            )}
          </div>
        </nav>

        {/* Quick capture for admins */}
        {user?.isAdmin && (
          <div className="anim-fade-up anim-stagger-1">
            <QuickCapture onSaved={refresh} />
          </div>
        )}

        {/* Notes feed */}
        <div className="notes-feed anim-fade-up anim-stagger-2">
          {notes.length === 0 ? (
            <div className="empty-state">
              <p>No notes yet.</p>
            </div>
          ) : (
            notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                isAdmin={user?.isAdmin ?? false}
                onDeleted={refresh}
              />
            ))
          )}
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
