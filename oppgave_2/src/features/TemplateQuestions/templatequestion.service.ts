import {produceFriendlyError} from "@/features/HelperFeatures/serviceFunctions/serviceErrorSwitch";
import {
    addTemplateQuestion,
    getAllTemplateQuestions, getRandomTemplates, getTemplateQuestionsByTemplateId
} from "@/features/TemplateQuestions/templatequestion.repository";
import type {templateQuestion} from "@/types/template";
import type {serviceResult} from "@/types/DatatransferTypes";


export const handleCreateTemplateQuestion = async (templateQuestion: templateQuestion): Promise<serviceResult<templateQuestion>> => {
    const returnedTemplateQuestion = await addTemplateQuestion(templateQuestion);

    if(returnedTemplateQuestion.error) {
        return produceFriendlyError<templateQuestion>(returnedTemplateQuestion.error, "Report", returnedTemplateQuestion.dbCause)
    }
    return {success: true, data: returnedTemplateQuestion.data}
}

export const handleGetAllTemplateQuestions = async (): Promise <serviceResult<templateQuestion[]>> => {
    const templateQuestions = await getAllTemplateQuestions();

    if(templateQuestions.error) {
        return produceFriendlyError<templateQuestion[]>(templateQuestions.error, "Activity", templateQuestions.dbCause)
    }

    return {success: true, data: templateQuestions.data}
}

export const handleGetRandomTemplateQuestions = async (amount: number): Promise <serviceResult<templateQuestion[]>> => {
    const templateQuestions = await getRandomTemplates(amount);

    if(templateQuestions.error) {
        return produceFriendlyError<templateQuestion[]>(templateQuestions.error, "Activity", templateQuestions.dbCause)
    }

    return {success: true, data: templateQuestions.data}
}

export const handleGetQuestionsByTemplateId = async (templateId: string): Promise <serviceResult<templateQuestion[]>> => {
    const templateQuestions = await getTemplateQuestionsByTemplateId(templateId);

    if(templateQuestions.error) {
        return produceFriendlyError<templateQuestion[]>(templateQuestions.error, "Activity", templateQuestions.dbCause)
    }

    return {success: true, data: templateQuestions.data}
}