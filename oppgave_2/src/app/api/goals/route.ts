import type {NextRequest, NextResponse} from "next/server";
import {resolveCreateGoal} from "@/features/Goals/goals.controller";

export async function POST(request: NextRequest): Promise<NextResponse> {
    return await resolveCreateGoal(request)
}