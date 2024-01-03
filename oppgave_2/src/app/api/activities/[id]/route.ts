import type {NextRequest, NextResponse} from "next/server";
import {
    resolveDeleteActivity,
    resolveGetActivitiesByActivityId
} from "@/features/Activities/activities.controller";
import type {resourceRequestById} from "@/types/contextTypes";

export async function GET(request: NextRequest,  context: resourceRequestById): Promise<NextResponse> {
    return await resolveGetActivitiesByActivityId(request, context)
}


export async function DELETE(request: NextRequest,  context: resourceRequestById): Promise<NextResponse> {
    return await resolveDeleteActivity(request, context)
}
