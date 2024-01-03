import type {NextRequest, NextResponse} from "next/server";
import {
    resolveGetActivitiesByActivityIdWithReport
} from "@/features/Activities/activities.controller";
import type {resourceRequestById} from "@/types/contextTypes";

export async function GET(request: NextRequest,  context: resourceRequestById): Promise<NextResponse> {
    return await resolveGetActivitiesByActivityIdWithReport(request, context)
}

