import type {NextRequest} from "next/server"


import {
    processAnswerUpdate,
    processInitialAnswer,
    returnSelectionOfRandomElements
} from "@/features/questions/tasks.controller";



export async function POST(request: NextRequest) {
    return await processInitialAnswer(request)
}

export async function PUT(request: NextRequest) {
    return await processAnswerUpdate(request);
}

export async function GET(request: NextRequest) {
    return await returnSelectionOfRandomElements(request);
}
