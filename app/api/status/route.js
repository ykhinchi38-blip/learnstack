import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ maintenance: false, status: "ok" });
}
