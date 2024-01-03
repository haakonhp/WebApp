import type {NextRequest, NextResponse} from "next/server";
import {resolveCreateOrReplaceReport} from "@/features/Reports/report.controller";

export async function POST(request: NextRequest): Promise<NextResponse> {
    return await resolveCreateOrReplaceReport(request)
}