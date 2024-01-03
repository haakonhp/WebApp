import {Prisma, PrismaClient} from "@prisma/client";
import {produceDatabaseError} from "@/features/HelperFeatures/serviceFunctions/prismaKnownErrorSwitch";
import {errorCodes} from "@/types/errorCodes";
import type {templateQuestion} from "@/types/template";
import type {databaseResult} from "@/types/DatatransferTypes";
import type {QuestionVariant} from "@/types/stringVariants";

const prismaLocal = new PrismaClient()

export const addTemplateQuestion = async (templateQuestionInput: templateQuestion, prisma: PrismaClient = prismaLocal): Promise<databaseResult<templateQuestion>> => {
    try {
        const templateQuestion = await prisma.templateQuestion.create({
            data: {
                ...templateQuestionInput,
            }
        })
        return {success: true, data: templateQuestion}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<templateQuestion>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}


export const addLinkedTemplateQuestion = async (templateQuestionInput: { question: string; templateQuestionId: string | undefined; connectedTemplate: string; id?: string; type: QuestionVariant }, prisma: PrismaClient = prismaLocal): Promise<databaseResult<templateQuestion>> => {
    const {connectedTemplate, ...templateData} = templateQuestionInput
    try {
        const templateQuestion = await prisma.templateQuestion.upsert({
            where: {
                templateQuestionId: templateQuestionInput.templateQuestionId || ''
            },
            update: {
                templates: {
                    connect: {
                        id: connectedTemplate
                    }
                }
            },
            create: {
                ...templateData,
                templates: {
                    connect: {
                        id: connectedTemplate
                    }
                }
            }
        })
        return {success: true, data: templateQuestion}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<templateQuestion>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getTemplateQuestion = async (id: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<templateQuestion>> => {
    try {
        const templateQuestion = await prisma.templateQuestion.findUnique({
            where: {
                templateQuestionId: id
            }
        })
        return {success: true, data: templateQuestion}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<templateQuestion>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getAllTemplateQuestions = async (prisma: PrismaClient = prismaLocal): Promise<databaseResult<templateQuestion[]>> => {
    try {
        const templateQuestions = await prisma.templateQuestion.findMany({})
        return {success: true, data: templateQuestions}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<templateQuestion[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getRandomTemplates = async (amount: number, prisma: PrismaClient = prismaLocal): Promise<databaseResult<templateQuestion[]>> => {
    try {
        const totalElements = await prisma.templateQuestion.count({});
        const randomSkip = Math.floor(Math.random() * (Math.floor((totalElements - amount))));
        const data = await prisma.templateQuestion.findMany({
            skip: randomSkip > 0 ? randomSkip : 0,
            take: amount < totalElements ? amount : totalElements
        })
        return {success: true, data: data}
    } catch (e) {
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getTemplateQuestionsByTemplateId = async (templateId: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<templateQuestion[]>> => {
    try {
        const templateQuestions = await prisma.templateQuestion.findMany({
            where: {
                templates: {
                    some: {
                        id: templateId
                    }
                }
            }
        })
        return {success: true, data: templateQuestions}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<templateQuestion[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}