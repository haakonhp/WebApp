import type {NextRequest, NextResponse} from "next/server";
import {
    resolveGetActiveIntervalsFromTemplateByUser, resolveGetActiveIntervalsFromTemplateByUserSelected
} from "@/features/Activities/activities.controller";
import type {resourceByUserAndTemplate} from "@/types/contextTypes";

export async function GET(request: NextRequest,  context: resourceByUserAndTemplate): Promise<NextResponse> {
    return await resolveGetActiveIntervalsFromTemplateByUser(request, context)
}

export async function POST(request: NextRequest,  context: resourceByUserAndTemplate): Promise<NextResponse> {
    return await resolveGetActiveIntervalsFromTemplateByUserSelected(request, context)
}
