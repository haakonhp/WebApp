import {Prisma, PrismaClient} from "@prisma/client";
import {produceDatabaseError} from "@/features/HelperFeatures/serviceFunctions/prismaKnownErrorSwitch";
import {errorCodes} from "@/types/errorCodes";
import type {Question, QuestionInsert, QuestionUpdate} from "@/types/question";
import type {databaseResult} from "@/types/DatatransferTypes";
import {undefined} from "zod";

const prismaLocal = new PrismaClient()

export const addQuestion = async (singleQuestion: QuestionInsert, prisma: PrismaClient = prismaLocal): Promise<databaseResult<Question>> => {
    try {
        const question = await prisma.userActivityQuestions.create({
            data: {
                question: singleQuestion.question,
                type: singleQuestion.type,
                answer: "",
                UserActivity: {
                    connect: {
                        goalId: singleQuestion.connectedActivity
                    }
                }
            }
        })
        // Casting used because type: String doesn't conform to the string literals.
        // I've yet to find an elegant way to cast only a single object attribute, so here we are.
        return {success: true, data: question as Question}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<Question>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }}
export const updateQuestion = async (update: QuestionUpdate, prisma: PrismaClient = prismaLocal): Promise<databaseResult<Question>> => {
    try {
        const question = await prisma.userActivityQuestions.update({
            where: {
                id: update.id
            },
        data: {
                answer: update.answer
        }
        })
        return {success: true, data: question as Question}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<Question>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}    }
}

export const getQuestion = async (id: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<Question>> => {
    try {
        const question = await prisma.userActivityQuestions.findUnique({
            where: {
                id: id
            }
        })
        return {success: true, data: question as Question}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<Question>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}    }
}

export const getQuestionsByActivityId = async (activityId: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<Question[]>> => {
    try {
        const question = await prisma.userActivityQuestions.findMany({
            where: {
                connectedActivity: activityId
            }
        })
        return {success: true, data: question as Question[]}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<Question[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}    }
}

export const getQuestions = async (prisma: PrismaClient = prismaLocal): Promise<databaseResult<Question[]>> => {
    try {
        const questions = await prisma.userActivityQuestions.findMany({})
        return {success: true, data: questions as Question[]}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<Question[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}    }
}