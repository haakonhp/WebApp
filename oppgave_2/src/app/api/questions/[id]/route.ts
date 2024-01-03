import type {NextRequest, NextResponse} from "next/server";
import {resolveUpdateQuestionAnswer} from "@/features/Questions/questions.controller";
import {resourceRequestById} from "@/types/contextTypes";



export async function PATCH(request: NextRequest, context: resourceRequestById): Promise<NextResponse> {
    return await resolveUpdateQuestionAnswer(request, context)
}