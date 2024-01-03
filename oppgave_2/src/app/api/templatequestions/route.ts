import type {NextRequest, NextResponse} from "next/server";
import {
    resolveCreateTemplateQuestion,
    resolveGetAllTemplateQuestions
} from "@/features/TemplateQuestions/templatequestion.controller";

export async function POST(request: NextRequest): Promise<NextResponse> {
    return await resolveCreateTemplateQuestion(request)
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    return await resolveGetAllTemplateQuestions(request)
}