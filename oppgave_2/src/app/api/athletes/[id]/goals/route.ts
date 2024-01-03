import type { NextRequest, NextResponse } from "next/server"

import { resolveGetUserGoals } from "@/features/Goals/goals.controller"
import {type resourceRequestById} from "@/types/contextTypes";

export async function GET(
  request: NextRequest,
  context: resourceRequestById,
): Promise<NextResponse> {
  return await resolveGetUserGoals(request, context)
}
