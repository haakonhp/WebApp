import {Prisma, PrismaClient} from "@prisma/client";
import {produceDatabaseError} from "@/features/HelperFeatures/serviceFunctions/prismaKnownErrorSwitch";
import {errorCodes} from "@/types/errorCodes";
import type {TemplateInsert, TemplateResponse, userTemplateListNode} from "@/types/template";
import type {databaseResult} from "@/types/DatatransferTypes";

const prismaLocal = new PrismaClient()

export const createSingleTemplate = async (templateInput: TemplateInsert, prisma: PrismaClient = prismaLocal): Promise<databaseResult<TemplateResponse>> => {

    try {
        const template = await prisma.template.create({
            data: {
                ...templateInput
            }
        })
        return {success: true, data: template}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<TemplateResponse>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}


export const getTemplate = async (id: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<TemplateResponse>> => {
    try {
        const template = await prisma.template.findUnique({
            where: {
                id: id
            }
        })
        return {success: true, data: template}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<TemplateResponse>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}    }
}

export const getTemplates = async (prisma: PrismaClient = prismaLocal): Promise<databaseResult<TemplateResponse[]>> => {
    try {
        const templates = await prisma.template.findMany({})
        return {success: true, data: templates}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<TemplateResponse[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}    }
}

export const getTemplatesByUser = async (userId: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<userTemplateListNode[]>> => {
    try {
        const templates = await prisma.template.findMany({
            where: {
                userActivity: {
                    some: {
                        userId: userId
                    }
                }
            },
            select: {
                id: true,
                name: true,
                sport: true
            }
        })
        return {success: true, data: templates}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<userTemplateListNode[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}    }
}

export const getTemplatesExpanded = async (prisma: PrismaClient = prismaLocal): Promise<databaseResult<TemplateResponse[]>> => {
    try {
        const templates = await prisma.template.findMany({
            include: {
                UserActivityInterval: {
                    select: {
                        intensity: true,
                        duration: true
                    }
                },
                templateQuestions: true
            }
        })
        return {success: true, data: templates}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<TemplateResponse[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}    }
}

