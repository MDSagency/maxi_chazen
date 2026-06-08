import { NextResponse } from "next/server";
import { getAllWebsiteContent } from "@/lib/actions/content";

export async function GET() {
  const content = await getAllWebsiteContent();
  return NextResponse.json(content, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
