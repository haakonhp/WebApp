import type {NextRequest, NextResponse} from "next/server";
import {resolveGetQuestionsByActivityId} from "@/features/Questions/questions.controller";
import type {resourceRequestById} from "@/types/contextTypes";

export async function GET(request: NextRequest, context: resourceRequestById): Promise<NextResponse> {
    return await resolveGetQuestionsByActivityId(request, context)
}

