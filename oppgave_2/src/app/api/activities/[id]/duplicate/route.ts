import type {NextRequest, NextResponse} from "next/server";
import {
    resolveCreateDuplicateActivityById,
} from "@/features/Activities/activities.controller";
import type {resourceRequestById} from "@/types/contextTypes";

export async function POST(request: NextRequest, context: resourceRequestById): Promise<NextResponse> {
    return await resolveCreateDuplicateActivityById(request, context)
}
