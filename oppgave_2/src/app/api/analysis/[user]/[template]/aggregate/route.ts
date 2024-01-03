import type {NextRequest, NextResponse} from "next/server";
import {resolveAggregateFromActiveIntervals} from "@/features/Activities/activities.controller";
import type {resourceByUserAndTemplate} from "@/types/contextTypes";

export async function GET(request: NextRequest, context: resourceByUserAndTemplate): Promise<NextResponse> {
    return await resolveAggregateFromActiveIntervals(request, context)
}
