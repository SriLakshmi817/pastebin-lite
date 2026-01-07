"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [result, setResult] = useState("");

  async function createPaste() {
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        ttl_seconds: ttl ? Number(ttl) : undefined,
        max_views: views ? Number(views) : undefined,
      }),
    });

    if (!res.ok) {
      alert("Failed to create paste");
      return;
    }

    const data = await res.json();
    setResult(data.url);
  }

  return (
    <main style={{ padding: "20px" }}>
      <h1>Pastebin Lite</h1>

      <textarea
        placeholder="Enter your paste here"
        rows={10}
        style={{ width: "100%" }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="TTL seconds (optional)"
        value={ttl}
        onChange={(e) => setTtl(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Max views (optional)"
        value={views}
        onChange={(e) => setViews(e.target.value)}
      />

      <br /><br />

      <button onClick={createPaste}>Create Paste</button>

      {result && (
        <>
          <br /><br />
          <p>Paste created:</p>
          <a href={result}>{result}</a>
        </>
      )}
    </main>
  );
}