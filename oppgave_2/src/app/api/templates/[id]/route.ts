import type {NextRequest, NextResponse} from "next/server";
import type {resourceRequestById} from "@/types/contextTypes";
import {resolveGetTemplateQuestionsByTemplateId} from "@/features/TemplateQuestions/templatequestion.controller";

export async function GET(request: NextRequest,  context: resourceRequestById): Promise<NextResponse> {
    return await resolveGetTemplateQuestionsByTemplateId(request, context)
}
