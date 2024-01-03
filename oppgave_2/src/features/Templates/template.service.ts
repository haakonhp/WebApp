import {produceFriendlyError} from "@/features/HelperFeatures/serviceFunctions/serviceErrorSwitch";
import {
    createSingleTemplate,
    getTemplates,
    getTemplatesByUser,
    getTemplatesExpanded
} from "@/features/Templates/template.repository";
import {transformTags} from "@/features/HelperFeatures/serviceFunctions/TagCSVToArrayMapper";
import {addTemplateInterval, getIntervalCount} from "@/features/Activities/activities.repository";
import {addLinkedTemplateQuestion} from "@/features/TemplateQuestions/templatequestion.repository";
import {errorCodes} from "@/types/errorCodes";
import type {TemplateInsert, TemplateResponse, userTemplateListNode} from "@/types/template";
import type {serviceResult} from "@/types/DatatransferTypes";

export const handleCreateTemplate = async (template: TemplateInsert): Promise<serviceResult<TemplateResponse>> => {
    const templateTagsTransformed = transformTags(template);

    const {intervals, questions, ...templateData} = templateTagsTransformed

    const returnedTemplateResult = await createSingleTemplate(templateData);


    if (returnedTemplateResult.error) {
        return produceFriendlyError<TemplateInsert>(returnedTemplateResult.error, "Template", returnedTemplateResult.dbCause)
    }

    if (!returnedTemplateResult.data) {
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
    const connectedName = returnedTemplateResult.data.id;

    if(questions) {
    await Promise.all(questions.map(async (question) => {await addLinkedTemplateQuestion({templateQuestionId: question.id, ...question, connectedTemplate: connectedName})}))
    }

    if(intervals) {
    const baseNumber = await getIntervalCount(connectedName);
    const baseNumberAwaited = baseNumber.data ?? 0
    await Promise.all(intervals.map(async (interval, index) => {await addTemplateInterval({...interval, connectedActivity: connectedName}, (baseNumberAwaited + index))}))
    }
    return {success: true, data: returnedTemplateResult.data}
}

export const handleGetAllTemplates = async (): Promise<serviceResult<TemplateResponse[]>> => {
    const templates = await getTemplates();
    if (templates.error) {
        return produceFriendlyError<TemplateResponse[]>(templates.error, "Template", templates.dbCause)
    }

    return {success: true, data: templates.data}
}

export const handleGetTemplatesByUserId = async (userId: string): Promise<serviceResult<userTemplateListNode[]>> => {
    const templates = await getTemplatesByUser(userId);
    if (templates.error) {
        return produceFriendlyError<userTemplateListNode[]>(templates.error, "Template", templates.dbCause)
    }

    return {success: true, data: templates.data}
}


export const handleGetAllTemplatesExpanded = async (): Promise<serviceResult<TemplateResponse[]>> => {
    const templates = await getTemplatesExpanded();
    if (templates.error) {
        return produceFriendlyError<TemplateResponse[]>(templates.error, "Template", templates.dbCause)
    }


    return {success: true, data: templates.data}
}