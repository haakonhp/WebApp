import type {NextRequest, NextResponse} from "next/server";
import {resolveCreateTemplate, resolveGetAllTemplates} from "@/features/Templates/template.controller";

export async function POST(request: NextRequest): Promise<NextResponse> {
    return await resolveCreateTemplate(request)
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    return await resolveGetAllTemplates()
}