import {Prisma, PrismaClient} from "@prisma/client";
import {produceDatabaseError} from "@/features/HelperFeatures/serviceFunctions/prismaKnownErrorSwitch";
import type {Report} from "@/types/baseTypes";
import {errorCodes} from "@/types/errorCodes";
import type {databaseResult} from "@/types/DatatransferTypes";

const prismaLocal = new PrismaClient()

export const createOrReplaceSingleReport = async (reportInput: Report, prisma: PrismaClient = prismaLocal): Promise<databaseResult<Report>> => {
    try {
        const goal = await prisma.activityReport.upsert({
            where: {
                connectedActivity: reportInput.connectedActivity
            },
            update: {
                status: reportInput.status,
                comment: reportInput.comment ?? undefined
            },
            create: {
                status: reportInput.status,
                comment: reportInput.comment ?? undefined,
                UserActivity: {
                    connect: {
                        goalId: reportInput.connectedActivity
                    }
                }
            }
        })
        return {success: true, data: goal}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<Report>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }}

export const getReport = async (id: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<Report>> => {
    try {
        const report = await prisma.activityReport.findUnique({
            where: {
                id: id
            }
        })
        return {success: true, data: report}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<Report>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getReportsByUserId = async (userId: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<Report[]>> => {
    try {
        const report = await prisma.activityReport.findMany({
            where: {
                UserActivity: {
                    userId: userId
                }
            },
            include: {
                UserActivity: {
                    select: {
                        name: true,
                        goalId: true
                    }
                }
            }
        })
        return {success: true, data: report}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<Report[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}


export const getReports = async (prisma: PrismaClient = prismaLocal): Promise<databaseResult<Report[]>> => {
    try {
        const reports = await prisma.activityReport.findMany({})
        return {success: true, data: reports}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<Report[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}