import {type NextRequest, NextResponse} from "next/server";
import {produceNextResponseError} from "@/features/HelperFeatures/serviceFunctions/controllerErrorSwitch";
import {
    handleCreateTemplate,
    handleGetAllTemplates,
    handleGetAllTemplatesExpanded, handleGetTemplatesByUserId
} from "@/features/Templates/template.service";
import {extractJSONData} from "@/features/HelperFeatures/serviceFunctions/JSONDataExtraction";
import type  {resourceRequestById} from "@/types/contextTypes";
import type {TemplateInsert} from "@/types/template";

export const resolveCreateTemplate = async (request: NextRequest): Promise<NextResponse> => {
    if (request.headers.get("content-type") !== "application/json") {
        return NextResponse.json({success: false, data: {error: "Invalid request format, use JSON."}}, {status: 415})
    }

    const createTemplateRequest = await extractJSONData<TemplateInsert>(request);

    if (!createTemplateRequest) {
        return NextResponse.json({success: false, data: {error: "JSON Parsing error."}}, {status: 500})
    }
    const baseRequestExists = createTemplateRequest.name && createTemplateRequest.tags && createTemplateRequest.slug && createTemplateRequest.sport
    const lacksCheckboxes = !createTemplateRequest.intensityChecked && !createTemplateRequest.speedChecked && !createTemplateRequest.heartrateChecked &&
        !createTemplateRequest.wattChecked

    if (!baseRequestExists || lacksCheckboxes) {
        return NextResponse.json({
            success: false,
            data: {error: "Missing proper attributes for Template."}
        }, {status: 400})
    }

    const createTemplateResponse = await handleCreateTemplate(createTemplateRequest);

    if (createTemplateResponse.error) {
        return produceNextResponseError(createTemplateResponse.error, createTemplateResponse.dbCause);
    }

    return NextResponse.json({success: true, data: createTemplateResponse}, {status: 200})
}

export const resolveGetAllTemplates = async () => {
    const templates = await handleGetAllTemplates();

    if (templates.error) {
        return produceNextResponseError(templates.error, templates.dbCause);
    }

    return NextResponse.json({success: true, data: templates}, {status: 200})
}

export const resolveGetTemplatesByUserId = async (request: NextRequest, context: resourceRequestById) => {
    const templates = await handleGetTemplatesByUserId(context.params.id);

    if (templates.error) {
        return produceNextResponseError(templates.error, templates.dbCause);
    }

    return NextResponse.json({success: true, data: templates}, {status: 200})
}

export const resolveGetAllTemplatesExpanded = async () => {
    const templates = await handleGetAllTemplatesExpanded();

    if (templates.error) {
        return produceNextResponseError(templates.error, templates.dbCause);
    }

    return NextResponse.json({success: true, data: templates}, {status: 200})
}