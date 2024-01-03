import type { NextRequest, NextResponse } from "next/server"

import { resolveGetUserTournaments } from "@/features/Tournaments/tournament.controller"
import type {resourceRequestById} from "@/types/contextTypes";

export async function GET(
  request: NextRequest,
  context: resourceRequestById,
): Promise<NextResponse> {
  return await resolveGetUserTournaments(request, context)
}
