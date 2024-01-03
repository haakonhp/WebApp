import type {NextRequest, NextResponse} from "next/server";
import {
    resolveCreateInterval,
    resolveGetAllIntervalsFromActivityId
} from "@/features/Activities/activities.controller";
import type {resourceRequestById} from "@/types/contextTypes";

export async function GET(request: NextRequest, context: resourceRequestById): Promise<NextResponse> {
    return await resolveGetAllIntervalsFromActivityId(request, context)
}

export async function POST(request: NextRequest,  context: resourceRequestById): Promise<NextResponse> {
    return await resolveCreateInterval(request, context)
}