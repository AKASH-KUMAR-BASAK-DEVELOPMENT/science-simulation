import { NextResponse } from "next/server";
import { getVisitStats } from "../../../lib/visits";

export async function GET(request) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.VISITS_STATS_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getVisitStats();
  return NextResponse.json(stats);
}
