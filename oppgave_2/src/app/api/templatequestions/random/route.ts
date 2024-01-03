import type {NextRequest, NextResponse} from "next/server";
import {
    resolveGetRandomTemplateQuestions
} from "@/features/TemplateQuestions/templatequestion.controller";

export async function GET(request: NextRequest): Promise<NextResponse> {
    return await resolveGetRandomTemplateQuestions(request)
}