"use client";

import { useState, useCallback, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  initialNote?: {
    id: number;
    title: string;
    author: string;
    content: string;
    cover_url: string;
  };
}

async function compressImage(file: File): Promise<Blob> {
  const MAX_WIDTH = 1200;
  const MAX_HEIGHT = 2400;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      // Scale down to max width
      if (width > MAX_WIDTH) {
        height = (height * MAX_WIDTH) / width;
        width = MAX_WIDTH;
      }

      // Crop if too tall
      if (height > MAX_HEIGHT) {
        height = MAX_HEIGHT;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to compress image"));
        },
        "image/webp",
        0.85
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

async function uploadImage(file: File): Promise<string> {
  const compressed = await compressImage(file);
  const formData = new FormData();
  formData.append("file", compressed, "image.webp");

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = (await res.json()) as { url: string };
  return data.url;
}

export default function NoteEditor({ initialNote }: Props) {
  const [title, setTitle] = useState(initialNote?.title ?? "");
  const [author, setAuthor] = useState(initialNote?.author ?? "");
  const [content, setContent] = useState(initialNote?.content ?? "");
  const [coverUrl, setCoverUrl] = useState(initialNote?.cover_url ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      try {
        const url = await uploadImage(file);
        setCoverUrl(url);
      } catch {
        alert("Failed to upload image");
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const handleInlineImage = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      setUploading(true);
      try {
        const url = await uploadImage(file);
        const textarea = textareaRef.current;
        if (textarea) {
          const pos = textarea.selectionStart;
          const before = content.slice(0, pos);
          const after = content.slice(pos);
          setContent(`${before}\n![](${url})\n${after}`);
        }
      } catch {
        alert("Failed to upload image");
      } finally {
        setUploading(false);
      }
    };
    input.click();
  }, [content]);

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }
    if (!content.trim()) {
      alert("Please enter content");
      return;
    }

    setSaving(true);
    try {
      const body = { title, author, content, cover_url: coverUrl };

      if (initialNote?.id) {
        await fetch(`/api/notes/${initialNote.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      window.location.href = "/";
    } catch {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [title, author, content, coverUrl, initialNote?.id]);

  return (
    <>
      <div className="accent-bar" />
      <div className="app">
        <div className="editor-container">
          <a href="/" className="back-link">
            &larr; Back
          </a>

          <h2 style={{ marginBottom: 24, fontSize: "1.4rem", fontWeight: 700 }}>
            {initialNote ? "Edit Note" : "Write Note"}
          </h2>

          {/* Title & Author */}
          <div className="editor-fields">
            <div className="field-group">
              <label className="field-label">Book Title</label>
              <input
                className="field-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title..."
              />
            </div>
            <div className="field-group">
              <label className="field-label">Author</label>
              <input
                className="field-input"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name..."
              />
            </div>
          </div>

          {/* Cover */}
          <div className="cover-upload-area">
            <div
              className="cover-preview"
              onClick={() => coverInputRef.current?.click()}
            >
              {coverUrl ? (
                <img src={coverUrl} alt="Cover" />
              ) : (
                <span className="cover-placeholder">
                  {uploading ? "Uploading..." : "Cover"}
                </span>
              )}
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleCoverUpload}
            />
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Click to upload cover image
            </div>
          </div>

          {/* Toolbar */}
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <button className="btn btn-ghost" onClick={handleInlineImage} disabled={uploading}>
              {uploading ? "Uploading..." : "Insert Image"}
            </button>
          </div>

          {/* Split Editor */}
          <div className="editor-split">
            <div className="editor-pane">
              <div className="pane-label">Markdown</div>
              <textarea
                ref={textareaRef}
                className="editor-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your notes in Markdown..."
              />
            </div>
            <div className="preview-pane">
              <div className="pane-label">Preview</div>
              <div className="preview-content markdown-body">
                {content ? (
                  <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
                ) : (
                  <span style={{ color: "var(--text-muted)" }}>
                    Preview will appear here...
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="editor-actions">
            <a href="/" className="btn">
              Cancel
            </a>
            <button
              className="btn btn-accent"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>

        <footer className="footer">Zihui Notes &middot; Built with vinext</footer>
      </div>
    </>
  );
}
