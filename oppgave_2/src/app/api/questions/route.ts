import type {NextRequest, NextResponse} from "next/server";
import {resolveCreateQuestion} from "@/features/Questions/questions.controller";

export async function POST(request: NextRequest): Promise<NextResponse> {
    return await resolveCreateQuestion(request)
}