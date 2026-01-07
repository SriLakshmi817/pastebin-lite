import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content } = body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();

    return NextResponse.json(
      {
        id,
        url: `http://localhost:3000/p/${id}`,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create paste" },
      { status: 500 }
    );
  }
}