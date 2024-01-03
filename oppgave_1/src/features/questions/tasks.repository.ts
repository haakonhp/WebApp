import {PrismaClient} from "@prisma/client"
import {
    errorCodes} from "@/types";
import type {
    Answer,
    answerInsert,
    answerResponse, answerResponseInternal,
    databaseResult, feedBackDatabaseResponse,
     Task,
} from "@/types"

const prisma = new PrismaClient()

export const getAnswer = async ({userId, taskId}: Omit<answerInsert, "answer">): Promise<Answer | null> => {
    try {
        return await prisma.answer.findFirst({
                where: {
                    userId: userId,
                    taskId: taskId
                }
            }
        )
    } catch (e) {
        return null
    }
}
export const createAnswer = async ({userId, taskId}: answerInsert): Promise<databaseResult<answerResponse>> => {
    try {
        const existingElement = await getAnswer({userId, taskId})
        if (existingElement) {
            return {success: false, data: existingElement, error: "Repository: Duplicate entry", errorCode: errorCodes.DUPLICATE_DATABASE_ENTRY}
        }


        const createdAnswer = await prisma.answer.create({
            data: {
                userId,
                attempts: 1,
                task: {
                    connect: {
                        id: taskId
                    }
                }
            }
        })
        return {success: true, data: createdAnswer}
    } catch (e) {
        return {success: false, data: null, error: "Database error in creating answer.", errorCode: errorCodes.GENERIC_ERROR}
    }
}

export const updateAnswer = async ({userId, taskId}: answerInsert): Promise<databaseResult<answerResponse>> => {
    try {
        const existingElement = await getAnswer({userId, taskId})
        if (!existingElement) {
            return {success: false, data: null, error: "Issue with retrieving existing element.", errorCode: errorCodes.GENERIC_ERROR}
        }

        const updatedAnswer = await prisma.answer.update({
            where: {
                userId_taskId: {userId: userId, taskId: taskId}
            },
            data: {attempts: {increment: 1}}
        })
        return {success: true, data: updatedAnswer}
    } catch (e) {
        return {success: false, data: null, error: "Issue with updating element.", errorCode: errorCodes.GENERIC_ERROR}
    }
}

export const markAnswerAsComplete = async(id: string): Promise<databaseResult<null>> => {
    try {
        await prisma.answer.update({
            where: {
                id: id
            },
            data: {
                succeeded: true
            }
        })
        return {success: true, data: null}
    } catch (e) {
        return {success: false, data: null, error: "Error in marking answer as complete.", errorCode: errorCodes.GENERIC_ERROR}
    }
}

export const getAnswerState = async (id: string): Promise<databaseResult<answerResponseInternal>> => {
    try {
        const answerState = await prisma.answer.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                attempts: true,
                succeeded: true,
                task: {
                    select: {
                        solution: true,
                    }
                }
            }
        })
        if (answerState?.task == null) {
            return {success: false, data: null, error: "Set of elements returned is insufficient.", errorCode: errorCodes.GENERIC_ERROR}
        }
        return {success: true, data: answerState}
    } catch (e) {
        return {success: false, data: null, error: "Database error during retrieval of answer.", errorCode: errorCodes.GENERIC_ERROR}
    }
}

export const getRandomTasks = async (amount: number): Promise<databaseResult<Task[]>> => {
    try {
        const totalElements = await prisma.task.count();
        const randomSkip = Math.floor(Math.random() * (Math.floor((totalElements - amount))));
        const data = await prisma.task.findMany({
            select: {
                id: true,
                text: true,
                type: true,
                data: true
            },
            skip: randomSkip,
            take: amount
        }) as Task[]
        return {success: true, data: data}
    } catch (e) {
        return {success: false, data: null, error: "Database error during retrieval of answer.", errorCode: errorCodes.GENERIC_ERROR}
    }
}

export const getFeedbackSummary = async (userId: string): Promise<databaseResult<feedBackDatabaseResponse>> => {
    const answeredAssignments = await prisma.answer.count({
        where: {
            userId: userId
        }
    })
    if (!answeredAssignments) {
        return {success: false, data: null, error: "User has no answered assignments to base aggregate on."}
    }

    const totalSum = await prisma.answer.count({
        where: {
            userId: userId,
            succeeded: true
        }
    })
    // Gruppering på relaterte verdier er etter det jeg har funnet ut ikke natively støttet i Prisma.
    // Jeg henter derfor ut dette settet og gjør etterarbeid i stedet.
    const answeredQuestionsByType = await prisma.answer.findMany({
        where: {
            userId: userId,
            succeeded: false,
            task: {isNot: null}
        },
        select: {
            task: {
                select: {
                    type: true
                }
            }
        }
    })

    return {success: true, data: {typeResponse: answeredQuestionsByType, sumCorrect: totalSum}}
}

