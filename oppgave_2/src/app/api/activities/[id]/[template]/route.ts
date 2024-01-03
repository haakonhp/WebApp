import type {NextRequest, NextResponse} from "next/server";
import {resolveGetActivitiesByTemplateAndUserId} from "@/features/Activities/activities.controller";
import type {resourceByIdAndTemplate} from "@/types/contextTypes";

export async function GET(request: NextRequest,  context: resourceByIdAndTemplate): Promise<NextResponse> {
    return await resolveGetActivitiesByTemplateAndUserId(request, context)
}
