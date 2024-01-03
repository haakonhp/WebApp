import {addQuestion, getQuestionsByActivityId, updateQuestion} from "@/features/Questions/questions.repository";
import {produceFriendlyError} from "@/features/HelperFeatures/serviceFunctions/serviceErrorSwitch";
import type {Question, QuestionInsert, QuestionUpdate} from "@/types/question";
import type {serviceResult} from "@/types/DatatransferTypes";

export const handleCreateQuestion = async (question: QuestionInsert): Promise<serviceResult<Question>> => {
    const returnedQuestionResponse = await addQuestion(question);
    if(returnedQuestionResponse.error) {
        return produceFriendlyError<Question>(returnedQuestionResponse.error, "Question", returnedQuestionResponse.dbCause)
    }
    return {success: true, data: returnedQuestionResponse.data}
}

export const handleUpdateQuestion = async (question: QuestionUpdate): Promise<serviceResult<Question>> => {
    const returnedQuestionResponse = await updateQuestion(question);
    if(returnedQuestionResponse.error) {
        return produceFriendlyError<Question>(returnedQuestionResponse.error, "Question", returnedQuestionResponse.dbCause)
    }
    return {success: true, data: returnedQuestionResponse.data}
}

export const handleGetQuestionsByActivityId = async (id: string): Promise<serviceResult<Question[]>> => {
    const returnedQuestionResponse = await getQuestionsByActivityId(id);
    if(returnedQuestionResponse.error) {
        return produceFriendlyError<Question[]>(returnedQuestionResponse.error, "Question", returnedQuestionResponse.dbCause)
    }
    return {success: true, data: returnedQuestionResponse.data}
}