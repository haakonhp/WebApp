import type {NextRequest, NextResponse} from "next/server";
import {
    resolveAggregateFromActiveIntervalsGrouped,
    resolveAggregateFromActiveIntervalsGroupedSelected
} from "@/features/Activities/activities.controller";
import type {resourceByUserAndTemplate} from "@/types/contextTypes";

export async function GET(request: NextRequest, context: resourceByUserAndTemplate): Promise<NextResponse> {
    return await resolveAggregateFromActiveIntervalsGrouped(request, context)
}

export async function POST(request: NextRequest, context: resourceByUserAndTemplate): Promise<NextResponse> {
    return await resolveAggregateFromActiveIntervalsGroupedSelected(request, context)
}
