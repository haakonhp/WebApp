import type {NextRequest, NextResponse} from "next/server";
import type {resourceRequestById} from "@/types/contextTypes";
import {resolveGetReportByUserId} from "@/features/Reports/report.controller";

export async function GET(request: NextRequest,  context: resourceRequestById): Promise<NextResponse> {
    return await resolveGetReportByUserId(request, context)
}

