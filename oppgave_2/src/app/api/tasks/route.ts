import type {NextRequest, NextResponse} from "next/server";
import {resolveGetOutdatedActivities} from "@/features/Activities/activities.controller";
export async function GET(request: NextRequest): Promise<NextResponse> {
    return await resolveGetOutdatedActivities(request)
}