import {type NextRequest, NextResponse} from "next/server";
import {produceNextResponseError} from "@/features/HelperFeatures/serviceFunctions/controllerErrorSwitch";
import {handleCreateOrReplaceReport, handleGetReportsById} from "@/features/Reports/report.service";
import {extractJSONData} from "@/features/HelperFeatures/serviceFunctions/JSONDataExtraction";
import type {Report} from "@/types/baseTypes";
import type {resourceRequestById} from "@/types/contextTypes";

export const resolveCreateOrReplaceReport = async (request: NextRequest): Promise<NextResponse> => {
    if (request.headers.get("content-type") !== "application/json") {
        return NextResponse.json({success: false, data: {error: "Invalid request format, use JSON."}}, {status: 415})
    }

    const createReportRequest = await extractJSONData<Report>(request);
    if (!createReportRequest) {
        return NextResponse.json({success: false, data: {error: "JSON Parsing error."}}, {status: 500})
    }

    if (!createReportRequest.connectedActivity || !createReportRequest.status) {
        return NextResponse.json({
            success: false,
            data: {error: "Missing proper attributes for Report."}
        }, {status: 400})
    }

    const createReportResult = await handleCreateOrReplaceReport(createReportRequest);

    if (createReportResult.error) {
        return produceNextResponseError(createReportResult.error, createReportResult.dbCause);
    }

    return NextResponse.json({success: true, data: createReportResult}, {status: 200})
}

export const resolveGetReportByUserId = async (request: NextRequest, context: resourceRequestById): Promise<NextResponse> => {
    if (!context.params.id) {
        return NextResponse.json({success: false, data: {error: "Missing parameters."}}, {status: 400})
    }

    const questions = await handleGetReportsById(context.params.id)

    if (questions.error) {
        return produceNextResponseError(questions.error, questions.dbCause)
    }

    return NextResponse.json({success: true, data: questions}, {status: 200})
}