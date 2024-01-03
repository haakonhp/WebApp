import {
    type answerInsert,
    type answerResponse,
    type databaseResult,
    errorCodes,
    type feedbackSummary,
    type reducerSumCategories,
    type serviceResult,
    type Task
} from "@/types";
import {
    createAnswer,
    getAnswer,
    getAnswerState, getFeedbackSummary,
    getRandomTasks, markAnswerAsComplete,
    updateAnswer
} from "@/features/questions/tasks.repository";

export const checkPermissionToUpdate = async ({userId, taskId}: Omit<answerInsert, "answer">): Promise<boolean> => {
    const answerElement = await getAnswer({userId, taskId});
    if (!answerElement) {
        return true;
    }
    const answerStatus = await getAnswerState(answerElement.id);
    if (!answerStatus.data) {
        return true;
    }
    if (answerStatus.data.succeeded) {
        return false;
    }

    return answerStatus.data.attempts < 3;
}

export const processAnswer = async (dbResponse: databaseResult<answerResponse>, answer: number): Promise<serviceResult<answerResponse>> => {
    if (!dbResponse.data) {
        return {success: false, data: null, error: "Failed to process answer."}
    }
    const answerState = await getAnswerState(dbResponse.data.id);

    if (!answerState.data?.task) {
        return {
            success: false,
            data: null,
            error: "Failed to retrieve proper answerState.",
            errorCode: errorCodes.GENERIC_ERROR
        }
    }

    if (answer == answerState.data.task.solution) {
        const successful_update = await markAnswerAsComplete(answerState.data.id);
        if (!successful_update.success) {
            return {
                success: false,
                data: null,
                error: "Failed to update correct answer.",
                errorCode: errorCodes.GENERIC_ERROR
            }
        }
        return {success: true, data: {id: answerState.data.id, attempts: answerState.data.attempts, correct: true}}
    }

    if (answerState.data.attempts >= 3) {
        return {success: true, data: answerState.data}
    }

    return {success: true, data: {id: answerState.data.id, attempts: answerState.data.attempts, correct: false}}
}

export const createInitialAnswer = async ({userId, taskId, answer}: answerInsert): Promise<serviceResult<answerResponse>> => {
    const dbResponse = await createAnswer({userId, taskId, answer});

    if (dbResponse.errorCode == errorCodes.DUPLICATE_DATABASE_ENTRY) {
        const answerState = await getAnswerState(dbResponse.data!.id);

        if (!answerState.data) {
            return {
                success: false,
                data: dbResponse.data,
                error: "Service: Duplicate entry",
                errorCode: errorCodes.DUPLICATE_DATABASE_ENTRY
            }
        }
        if (answerState.data.attempts >= 3 || answerState.data.succeeded) {
            return {
                success: false,
                data: answerState.data,
                error: "Service: Duplicate entry",
                errorCode: errorCodes.DUPLICATE_DATABASE_ENTRY
            }
        }

        return {
            success: false,
            data: dbResponse.data,
            error: "Service: Duplicate entry",
            errorCode: errorCodes.DUPLICATE_DATABASE_ENTRY
        }
    }
    return processAnswer(dbResponse, answer)
}

export const updateExistingAnswer = async ({userId, taskId, answer}: answerInsert): Promise<serviceResult<answerResponse>> => {
    const allowedToUpdate = await checkPermissionToUpdate({userId, taskId})
    if (!allowedToUpdate) {
        return {
            success: false,
            data: null,
            error: "User is not allowed to update this value any further.",
            errorCode: errorCodes.USER_NOT_ALLOWED_TO_MODIFY
        }
    }
    const dbResponse = await updateAnswer({userId, taskId, answer});
    if (!dbResponse.data) {
        return {success: false, data: null, error: "Failed to update answer."}
    }
    return processAnswer(dbResponse, answer)
}

export const fetchSelectionOfRandomElement = async (amount: number): Promise<serviceResult<Task[]>> => {
    const databaseResult = await getRandomTasks(amount);
    if (databaseResult.success) {
        return {success: true, data: databaseResult.data}
    }
    return {success: false, data: null, error: databaseResult.error}
}
// TODO: Spør lærer om reduseren er for fancy.
export const produceFeedBacksummary = async (userId: string): Promise<serviceResult<feedbackSummary>> => {
    const feedbackDBResponse = await getFeedbackSummary(userId);
    if (!feedbackDBResponse.data?.typeResponse) {
        return {success: false, data: null}
    }
    let maxValue = 0;
    let maxElement = "";

    const extractedTypes: string[] = feedbackDBResponse.data.typeResponse.map(v => v.task!.type)
    // Utvidet basert på svar fra sheetJS - https://stackoverflow.com/questions/19395257/how-to-count-duplicate-value-in-an-array-in-javascript
    extractedTypes.reduce(function (map: reducerSumCategories, currentElement: string) {
        map[currentElement] = map[currentElement] + 1 || 1
        if (map[currentElement] > maxValue) {
            maxValue = map[currentElement]
            maxElement = currentElement
        }
        return map
    }, {});
    return {success: true, data: {successfulTasks: feedbackDBResponse.data.sumCorrect, mostDifficultOperation: maxElement, mostDifficultOperationErrors: maxValue}}
}
