import type {NextRequest, NextResponse} from "next/server";
import {resolveUpdateInterval} from "@/features/Activities/activities.controller";
import type {resourceRequestById} from "@/types/contextTypes";

export async function PATCH(request: NextRequest, context: resourceRequestById): Promise<NextResponse> {
    return await resolveUpdateInterval(request, context)
}