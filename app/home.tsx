"use client";

import type { Note, Recommendation } from "@/lib/db";
import type { User } from "@/lib/auth";

interface Props {
  notes: Note[];
  recommendations: Recommendation[];
  user: User | null;
}

function stripMarkdown(md: string): string {
  return md
    .replace(/[#*_`~\[\]()>!-]/g, "")
    .replace(/\n+/g, " ")
    .trim();
}

function formatDate(date: string): string {
  return date.slice(0, 10);
}

export default function HomePage({ notes, recommendations, user }: Props) {
  const parsedRecs = recommendations.map((r) => ({
    ...r,
    parsedTags: JSON.parse(r.tags || "[]") as string[],
  }));

  return (
    <>
      <div className="accent-bar" />
      <div className="app">
        {/* Nav */}
        <nav className="nav">
          <div className="nav-brand">
            <span className="nav-dot" />
            <div>
              <span className="nav-title">Zihui Notes</span>
              <div className="nav-subtitle">reading notes & thoughts</div>
            </div>
          </div>
          <div className="nav-actions">
            {user?.isAdmin && (
              <a href="/write" className="btn btn-accent">
                + Write
              </a>
            )}
            {user ? (
              <form action="/api/auth/logout" method="POST" style={{ display: "inline" }}>
                <button type="submit" className="btn btn-ghost">
                  <span className="user-badge">
                    @{user.github_login}
                  </span>
                  Logout
                </button>
              </form>
            ) : (
              <a href="/api/auth/login" className="btn">
                <svg
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Sign in
              </a>
            )}
          </div>
        </nav>

        {/* Notes Section */}
        <div className="section-header">
          <h2 className="section-title">Reading Notes</h2>
          <p className="section-desc">
            {notes.length > 0
              ? `${notes.length} notes collected`
              : "No notes yet"}
          </p>
        </div>

        {notes.length === 0 ? (
          <div className="empty-state">
            <h3>No notes yet</h3>
            <p>
              {user?.isAdmin
                ? 'Click "+ Write" to create your first note.'
                : "Check back later for reading notes."}
            </p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <a
                key={note.id}
                href={`/note/${note.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="note-card fade-up">
                  {note.cover_url && (
                    <div
                      className="note-card-cover"
                      style={{ backgroundImage: `url(${note.cover_url})` }}
                    />
                  )}
                  <div className="note-card-body">
                    <div className="note-card-title">{note.title}</div>
                    <div className="note-card-author">
                      {note.author || "Unknown"}
                    </div>
                    <div className="note-card-excerpt">
                      {stripMarkdown(note.content).slice(0, 120)}...
                    </div>
                    <div className="note-card-date">
                      {formatDate(note.created_at)}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Recommendations Section */}
        {parsedRecs.length > 0 && (
          <>
            <div className="section-header">
              <h2 className="section-title">Recommended Reading</h2>
              <p className="section-desc">
                Curated book recommendations across literature, tech, and
                finance
              </p>
            </div>
            <div className="rec-grid">
              {parsedRecs.slice(0, 12).map((rec) => (
                <div key={rec.id} className="rec-card">
                  <div className="rec-card-category">{rec.category}</div>
                  <div className="rec-card-title">{rec.title}</div>
                  <div className="rec-card-author">{rec.author}</div>
                  <div className="rec-card-desc">{rec.description}</div>
                  <div className="rec-tags">
                    {rec.parsedTags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rec-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <footer className="footer">Zihui Notes &middot; Built with vinext</footer>
      </div>
    </>
  );
}
