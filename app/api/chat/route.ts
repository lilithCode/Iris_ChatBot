import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const backendUrl = process.env.AMADEUS_BACKEND_URL;
    const apiKey = process.env.AMADEUS_API_KEY;

    if (!backendUrl || !apiKey) {
      return NextResponse.json(
        { reply: "[SYSTEM_ERROR] Server misconfigured." },
        { status: 500 },
      );
    }

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { reply: "[SYSTEM_ERROR]" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ reply: "[SYSTEM_ERROR]" }, { status: 500 });
  }
}
