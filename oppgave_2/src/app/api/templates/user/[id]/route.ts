import type {NextRequest, NextResponse} from "next/server";
import {resolveGetTemplatesByUserId} from "@/features/Templates/template.controller";
import type {resourceRequestById} from "@/types/contextTypes";

export async function GET(request: NextRequest,  context: resourceRequestById): Promise<NextResponse> {
    return await resolveGetTemplatesByUserId(request, context)
}
