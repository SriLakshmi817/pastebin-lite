import { notFound } from "next/navigation";

async function getPaste(id: string) {
  const res = await fetch(`http://localhost:3000/api/pastes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ FIX HERE

  if (!id) {
    notFound();
  }

  const paste = await getPaste(id);

  if (!paste) {
    notFound();
  }

  return (
    <main style={{ padding: 20 }}>
      <h2>Paste</h2>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#111",
          padding: "16px",
          borderRadius: "6px",
        }}
      >
        {paste.content}
      </pre>
    </main>
  );
}