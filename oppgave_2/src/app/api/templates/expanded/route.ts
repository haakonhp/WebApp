import type {NextRequest, NextResponse} from "next/server";
import {
    resolveGetAllTemplatesExpanded
} from "@/features/Templates/template.controller";


export async function GET(request: NextRequest): Promise<NextResponse> {
    return await resolveGetAllTemplatesExpanded()
}