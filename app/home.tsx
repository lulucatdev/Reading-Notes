"use client";

import { useEffect, useRef } from "react";
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

const GITHUB_SVG = (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

// Flowing ink particles background
function useInkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let width = 0;
    let height = 0;
    let animId = 0;

    interface Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      alpha: number;
      drift: number;
      phase: number;
      speed: number;
    }

    let particles: Particle[] = [];

    function resize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
      initParticles();
    }

    function initParticles() {
      particles = [];
      const count = Math.floor((width * height) / 8000);
      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.08 + 0.03,
          drift: Math.random() * 2 - 1,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.3 + 0.1,
        });
      }
    }

    let time = 0;

    function animate() {
      ctx.clearRect(0, 0, width, height);
      time += 0.008;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const MOUSE_RADIUS = 200;

      for (const p of particles) {
        // Gentle organic drift
        p.x = p.baseX + Math.sin(time + p.phase) * p.drift * 15;
        p.y = p.baseY + Math.cos(time * 0.7 + p.phase) * p.drift * 8;

        // Mouse interaction — particles flow away like ink disturbed by a brush
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let drawX = p.x;
        let drawY = p.y;
        let drawAlpha = p.alpha;
        let drawSize = p.size;

        if (dist < MOUSE_RADIUS) {
          const force = (1 - dist / MOUSE_RADIUS);
          const angle = Math.atan2(dy, dx);
          drawX += Math.cos(angle) * force * 40;
          drawY += Math.sin(angle) * force * 40;
          drawAlpha = p.alpha + force * 0.2;
          drawSize = p.size + force * 2;

          // Draw connection lines between nearby disturbed particles
          if (force > 0.3) {
            for (const q of particles) {
              if (q === p) continue;
              const qdx = q.x - mx;
              const qdy = q.y - my;
              const qdist = Math.sqrt(qdx * qdx + qdy * qdy);
              if (qdist < MOUSE_RADIUS) {
                const d = Math.sqrt((drawX - q.x) ** 2 + (drawY - q.y) ** 2);
                if (d < 80) {
                  const lineAlpha = (1 - d / 80) * force * 0.1;
                  ctx.beginPath();
                  ctx.moveTo(drawX, drawY);
                  ctx.lineTo(q.x, q.y);
                  ctx.strokeStyle = `rgba(243, 128, 32, ${lineAlpha})`;
                  ctx.lineWidth = 0.5;
                  ctx.stroke();
                }
              }
            }
          }
        }

        // Fade edges
        const edgeFade = Math.min(
          drawX / 60, (width - drawX) / 60,
          drawY / 60, (height - drawY) / 60,
          1
        );

        ctx.beginPath();
        ctx.arc(drawX, drawY, drawSize, 0, Math.PI * 2);

        // Color blend: gray default, orange near mouse
        if (dist < MOUSE_RADIUS) {
          const t = 1 - dist / MOUSE_RADIUS;
          const r = Math.round(146 + (243 - 146) * t);
          const g = Math.round(155 + (128 - 155) * t);
          const b = Math.round(176 + (32 - 176) * t);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${drawAlpha * edgeFade})`;
        } else {
          ctx.fillStyle = `rgba(146, 155, 176, ${drawAlpha * edgeFade})`;
        }
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    }

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX + "px";
        glowRef.current.style.top = e.clientY + "px";
        glowRef.current.classList.add("active");
      }
    };

    const handleLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
      glowRef.current?.classList.remove("active");
    };

    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", handleMouse);
    document.addEventListener("mouseleave", handleLeave);
    resize();
    animate();

    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", handleMouse);
      document.removeEventListener("mouseleave", handleLeave);
      observer.disconnect();
    };
  }, []);

  return { canvasRef, glowRef };
}

function SiteFooter() {
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
              Independent Researcher & Builder. Exploring technology, venture capital, and building tools that matter.
            </p>
          </div>

          <div>
            <div className="footer-heading">Projects</div>
            <div className="footer-links">
              <a href="https://zihuichen.com" target="_blank" rel="noopener noreferrer" className="footer-link">Homepage</a>
              <a href="https://vc.zihuichen.com" target="_blank" rel="noopener noreferrer" className="footer-link">VC Radar</a>
              <a href="https://notes.zihuichen.com" className="footer-link">Reading Notes</a>
            </div>
          </div>

          <div>
            <div className="footer-heading">Links</div>
            <div className="footer-links">
              <a href="https://github.com/chenzihui222" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
              <a href="https://github.com/chenzihui222/Reading-Notes" target="_blank" rel="noopener noreferrer" className="footer-link">Source Code</a>
            </div>
          </div>

          <div>
            <div className="footer-heading">Tech Stack</div>
            <div className="footer-links">
              <span className="footer-link" style={{ cursor: "default" }}>vinext + React</span>
              <span className="footer-link" style={{ cursor: "default" }}>Cloudflare Workers</span>
              <span className="footer-link" style={{ cursor: "default" }}>D1 + R2</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">&copy; {year} Zihui Chen. All rights reserved.</span>
          <div className="footer-socials">
            <a
              href="https://github.com/chenzihui222"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social"
            >
              {GITHUB_SVG}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage({ notes, recommendations, user }: Props) {
  const { canvasRef, glowRef } = useInkBackground();

  const parsedRecs = recommendations.map((r) => ({
    ...r,
    parsedTags: JSON.parse(r.tags || "[]") as string[],
  }));

  return (
    <>
      <div className="accent-bar" />
      <canvas id="ink-canvas" ref={canvasRef} />
      <div id="mouse-glow" ref={glowRef} />

      <div className="app">
        {/* Nav */}
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
            {user?.isAdmin && (
              <a href="/write" className="btn btn-accent">+ Write</a>
            )}
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

        {/* Hero */}
        <div className="hero">
          <div className="anim-fade-up anim-stagger-1">
            <span className="hero-label">reading notes & book recommendations</span>
          </div>
          <h1 className="anim-fade-up anim-stagger-2">
            Reading Notes<span className="accent-dot">.</span>
          </h1>
          <p className="hero-desc anim-fade-up anim-stagger-3">
            A personal collection of reading notes, thoughts, and curated book recommendations across literature, technology, and finance.
          </p>
          <div className="hero-stats anim-fade-up anim-stagger-4">
            <div className="stat-chip">
              <span className="stat-dot" style={{ background: "#f38020" }} />
              {notes.length} Notes
            </div>
            <div className="stat-chip">
              <span className="stat-dot" style={{ background: "#059669" }} />
              {recommendations.length} Recommendations
            </div>
            <div className="stat-chip">
              <span className="stat-dot" style={{ background: "#2563eb" }} />
              3 Categories
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="reveal">
          <div className="section-header">
            <span className="section-line" />
            <span className="section-label">Notes</span>
          </div>
          <h2 className="section-title">
            Reading Notes<span style={{ color: "var(--accent)" }}>.</span>
          </h2>
          <p className="section-desc">
            {notes.length > 0 ? `${notes.length} notes collected` : "No notes yet — check back soon."}
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
            {notes.map((note, i) => (
              <a
                key={note.id}
                href={`/note/${note.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
                className="reveal"
              >
                <div className="note-card" style={{ transitionDelay: `${i * 0.05}s` }}>
                  {note.cover_url && (
                    <div
                      className="note-card-cover"
                      style={{ backgroundImage: `url(${note.cover_url})` }}
                    />
                  )}
                  <div className="note-card-body">
                    <div className="note-card-title">{note.title}</div>
                    <div className="note-card-author">{note.author || "Unknown"}</div>
                    <div className="note-card-excerpt">
                      {stripMarkdown(note.content).slice(0, 120)}...
                    </div>
                    <div className="note-card-date">{formatDate(note.created_at)}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Recommendations */}
        {parsedRecs.length > 0 && (
          <div className="reveal">
            <div className="section-header">
              <span className="section-line" />
              <span className="section-label">Library</span>
            </div>
            <h2 className="section-title">
              Recommended Reading<span style={{ color: "var(--accent)" }}>.</span>
            </h2>
            <p className="section-desc">
              Curated book recommendations across literature, tech, and finance
            </p>

            <div className="rec-grid" style={{ marginTop: 20 }}>
              {parsedRecs.slice(0, 12).map((rec) => (
                <div key={rec.id} className="rec-card">
                  <div className="rec-card-category">{rec.category}</div>
                  <div className="rec-card-title">{rec.title}</div>
                  <div className="rec-card-author">{rec.author}</div>
                  <div className="rec-card-desc">{rec.description}</div>
                  <div className="rec-tags">
                    {rec.parsedTags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rec-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <SiteFooter />
    </>
  );
}

export { SiteFooter };
