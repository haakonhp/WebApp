import {
    createInitialAnswer,
    fetchSelectionOfRandomElement, produceFeedBacksummary,
    updateExistingAnswer
} from "@/features/questions/tasks.service";
import {type NextRequest, NextResponse} from "next/server";
import {type answerInsert, errorCodes} from "@/types";

export const extractAnswerFromJSONRequest = async (request: NextRequest): Promise<answerInsert> => {
    const userResponse = await request.json() as answerInsert;
    const answer = userResponse.answer;
    const userId = userResponse.userId.toString();
    const taskId = userResponse.taskId.toString();

    return {userId: userId, taskId: taskId, answer: answer}
}

export const processInitialAnswer = async (request: NextRequest): Promise<NextResponse> => {
    const userResponse = await extractAnswerFromJSONRequest(request);

    if (userResponse.userId == null || userResponse.taskId == null) {
        return NextResponse.json({success: false, data: {error: "Missing proper attributes."}}, {status: 400})
    }

    const answerResponse = await createInitialAnswer(userResponse);

    if (answerResponse.success) {
        return NextResponse.json({success: true, data: answerResponse}, {status: 200})
    }

    if (answerResponse.errorCode === errorCodes.DUPLICATE_DATABASE_ENTRY) {
        return NextResponse.json({success: false, data: answerResponse, error: "Entry already exists. Previous entry is returned to allow for resumption of task."}, {status: 409})
    }
    return NextResponse.json({success: false, data: {error: answerResponse.error}}, {status: 500})
}

export const processAnswerUpdate = async (request: NextRequest): Promise<NextResponse> => {
    const userResponse = await extractAnswerFromJSONRequest(request);

    if (userResponse.userId == null || userResponse.taskId == null) {
        return NextResponse.json({success: false, data: {error: "Missing proper attributes."}}, {status: 400})
    }
    const updateResponse = await updateExistingAnswer(userResponse)

    if (updateResponse.success) {
        return NextResponse.json({success: true, data: updateResponse}, {status: 200})
    }

    if (updateResponse.errorCode === errorCodes.USER_NOT_ALLOWED_TO_MODIFY) {
        return NextResponse.json({success: false, data: updateResponse.error}, {status: 403})
    }
    return NextResponse.json({success: false, data: null, error: updateResponse.error}, {status: 500})
}

export const returnSelectionOfRandomElements = async (request: NextRequest): Promise<NextResponse> => {
    const count = request.nextUrl.searchParams.get("count")

    if (!count) {
        return NextResponse.json({success: false, error: "Invalid count"})
    }

    const taskFetch = await fetchSelectionOfRandomElement(parseInt(count));

    if (taskFetch.success) {
        return NextResponse.json({success: true, data: taskFetch.data})
    }
    return NextResponse.json({success: false, data: null}, {status: 500})
}

export const handleFeedbackRequest = async (request: NextRequest): Promise<NextResponse> => {
    const userId = request.nextUrl.searchParams.get("userId")
    if (!userId) {
        return NextResponse.json({success: false, error: "Requires userID."})
    }

    const summary = await produceFeedBacksummary(userId)
    return NextResponse.json({success: true, data: summary})
}