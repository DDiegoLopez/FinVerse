import { NextResponse } from "next/server";
import { searchStocks } from "@/lib/actions/finnhub.actions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? undefined;
    const results = await searchStocks(q);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}
