import {type NextRequest, NextResponse} from "next/server";
import {produceNextResponseError} from "@/features/HelperFeatures/serviceFunctions/controllerErrorSwitch";
import {
    handleCreateTemplateQuestion,
    handleGetAllTemplateQuestions,
    handleGetQuestionsByTemplateId, handleGetRandomTemplateQuestions
} from "@/features/TemplateQuestions/templatequestion.service";
import {extractJSONData} from "@/features/HelperFeatures/serviceFunctions/JSONDataExtraction";
import type {templateQuestion} from "@/types/template";
import type {resourceRequestById} from "@/types/contextTypes";
import {errorCodes} from "@/types/errorCodes";

export const resolveGetTemplateQuestionsByTemplateId = async (request: NextRequest, context: resourceRequestById): Promise<NextResponse> => {
    if (!context.params.id) {
        return NextResponse.json({success: false, data: null}, {status: 400})
    }

    const intervals = await handleGetQuestionsByTemplateId(context.params.id);

    if (intervals.error) {
        return produceNextResponseError(intervals.error, intervals.dbCause);
    }

    return NextResponse.json({success: true, data: intervals}, {status: 200})
}

export const resolveCreateTemplateQuestion = async (request: NextRequest): Promise<NextResponse> => {
    if (request.headers.get("content-type") !== "application/json") {
        return NextResponse.json({success: false, data: {error: "Invalid request format, use JSON."}}, {status: 415})
    }

    const createTemplateQuestionRequest = await extractJSONData<templateQuestion>(request);
    if (!createTemplateQuestionRequest) {
        return NextResponse.json({success: false, data: {error: "JSON Parsing error."}}, {status: 500})
    }
    
    if (!createTemplateQuestionRequest.question || !createTemplateQuestionRequest.type ) {
        return NextResponse.json({
            success: false,
            data: {error: "Missing proper attributes for Question."}
        }, {status: 400})
    }

    if(!["radio:mood", "radio:range", "text"].includes(createTemplateQuestionRequest.type)) {
        return NextResponse.json({success: false, data: {error: "Type is of incorrect format."}}, {status: 400})
    }

    const createTemplateQuestionResponse = await handleCreateTemplateQuestion(createTemplateQuestionRequest);

    if (createTemplateQuestionResponse.error) {
        return produceNextResponseError(createTemplateQuestionResponse.error, createTemplateQuestionResponse.dbCause);
    }

    return NextResponse.json({success: true, data: createTemplateQuestionResponse}, {status: 200})
}

export const resolveGetAllTemplateQuestions = async (request: NextRequest): Promise<NextResponse> => {
    const templateQuestions = await handleGetAllTemplateQuestions();

    if(templateQuestions.error) {
        return produceNextResponseError(templateQuestions.error, templateQuestions.dbCause);
    }

    return NextResponse.json({success: true, data: templateQuestions}, {status: 200})
}

export const resolveGetRandomTemplateQuestions = async (request: NextRequest): Promise<NextResponse> => {
    const count = request.nextUrl.searchParams.get("count");

    if(!count) {
        return produceNextResponseError(errorCodes.LACKING_QUERY_ELEMENTS, "count");
    }

    const templateQuestions = await handleGetRandomTemplateQuestions(parseInt(count));

    if(templateQuestions.error) {
        return produceNextResponseError(templateQuestions.error, templateQuestions.dbCause);
    }

    return NextResponse.json({success: true, data: templateQuestions}, {status: 200})
}