import { NextResponse } from "next/server";
import { getVisitStats } from "../../../../lib/visits";

export async function GET() {
  const { total } = await getVisitStats();
  return NextResponse.json({ total });
}
