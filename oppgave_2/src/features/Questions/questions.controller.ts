import {type NextRequest, NextResponse} from "next/server";
import {
    handleCreateQuestion,
    handleGetQuestionsByActivityId,
    handleUpdateQuestion
} from "@/features/Questions/questions.service";
import {produceNextResponseError} from "@/features/HelperFeatures/serviceFunctions/controllerErrorSwitch";
import {extractJSONData} from "@/features/HelperFeatures/serviceFunctions/JSONDataExtraction";
import type {QuestionInsert, QuestionUpdate} from "@/types/question";
import type {resourceRequestById} from "@/types/contextTypes";

export const resolveCreateQuestion = async (request: NextRequest): Promise<NextResponse> => {
    if (request.headers.get("content-type") !== "application/json") {
        return NextResponse.json({success: false, data: {error: "Invalid request format, use JSON."}}, {status: 415})
    }

    const createUserRequest = await extractJSONData<QuestionInsert>(request);
    if (!createUserRequest) {
        return NextResponse.json({success: false, data: {error: "JSON Parsing error."}}, {status: 500})
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!createUserRequest.question || !createUserRequest.type || !createUserRequest.connectedActivity) {
        return NextResponse.json({
            success: false,
            data: {error: "Missing proper attributes for Question."}
        }, {status: 400})
    }

    if (!["radio:mood", "radio:range", "text"].includes(createUserRequest.type)) {
        return NextResponse.json({success: false, data: {error: "Type is of incorrect format."}}, {status: 400})
    }

    const questionResult = await handleCreateQuestion(createUserRequest);

    if (questionResult.error) {
        return produceNextResponseError(questionResult.error, questionResult.dbCause);
    }

    return NextResponse.json({success: true, data: questionResult}, {status: 200})

}

export const resolveUpdateQuestionAnswer = async (request: NextRequest, context: resourceRequestById): Promise<NextResponse> => {
    if (request.headers.get("content-type") !== "application/json") {
        return NextResponse.json({success: false, data: {error: "Invalid request format, use JSON."}}, {status: 415})
    }
    const updateQuestionRequest = await extractJSONData<QuestionUpdate>(request);
    if (!updateQuestionRequest) {
        return NextResponse.json({success: false, data: {error: "JSON Parsing error."}}, {status: 500})
    }

    if (!updateQuestionRequest.id) {
        updateQuestionRequest.id = context.params.id
    }

    if (!updateQuestionRequest.answer || !updateQuestionRequest.id) {
        return NextResponse.json({
            success: false,
            data: {error: "Missing properties to update Question."}
        }, {status: 400})
    }

    const question = await handleUpdateQuestion(updateQuestionRequest)

    if (question.error) {
        return produceNextResponseError(question.error, question.dbCause)
    }

    return NextResponse.json({success: true, data: question}, {status: 200})
}

export const resolveGetQuestionsByActivityId = async (request: NextRequest, context: resourceRequestById): Promise<NextResponse> => {
    if (!context.params.id) {
        return NextResponse.json({success: false, data: {error: "Missing parameters."}}, {status: 400})
    }

    const questions = await handleGetQuestionsByActivityId(context.params.id)

    if (questions.error) {
        return produceNextResponseError(questions.error, questions.dbCause)
    }

    return NextResponse.json({success: true, data: questions}, {status: 200})
}