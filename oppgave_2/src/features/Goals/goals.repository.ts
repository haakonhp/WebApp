import {Prisma, PrismaClient} from "@prisma/client"

import {produceDatabaseError} from "@/features/HelperFeatures/serviceFunctions/prismaKnownErrorSwitch"
import type {Goal} from "@/types/baseTypes";
import {errorCodes} from "@/types/errorCodes";
import type {databaseResult} from "@/types/DatatransferTypes";

const prismaLocal = new PrismaClient()

export const createSingleGoal = async (
    goalInput: Goal,
    prisma: PrismaClient = prismaLocal,
): Promise<databaseResult<Goal>> => {
    try {
        const goal = await prisma.personalGoal.create({
            data: {
                ...goalInput,
            },
        })
        return {success: true, data: goal}
    } catch (e) {
        if (
            e instanceof Prisma.PrismaClientKnownRequestError ||
            e instanceof Prisma.PrismaClientValidationError
        ) {
            return produceDatabaseError<Goal>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getGoalById = async (
    id: string,
    prisma: PrismaClient = prismaLocal,
): Promise<databaseResult<Goal>> => {
    try {
        const goal = await prisma.personalGoal.findUnique({
            where: {
                id: id,
            },
        })
        return {success: true, data: goal}
    } catch (e) {
        if (
            e instanceof Prisma.PrismaClientKnownRequestError ||
            e instanceof Prisma.PrismaClientValidationError
        ) {
            return produceDatabaseError<Goal>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getGoals = async (
    prisma: PrismaClient = prismaLocal,
): Promise<databaseResult<Goal[]>> => {
    try {
        const goals = await prisma.personalGoal.findMany({})
        return {success: true, data: goals}
    } catch (e) {
        if (
            e instanceof Prisma.PrismaClientKnownRequestError ||
            e instanceof Prisma.PrismaClientValidationError
        ) {
            return produceDatabaseError<Goal[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getGoalsByUserId = async (userId: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<Goal[]>> => {
    try {
        const goals = await prisma.personalGoal.findMany({
            where: {
                userId: userId,
            },
        })

        if (!goals.length) {
            return {success: false, data: null, error: errorCodes.NO_CONTENT}
        }

        return {success: true, data: goals}
    } catch (e) {
        if (
            e instanceof Prisma.PrismaClientKnownRequestError ||
            e instanceof Prisma.PrismaClientValidationError
        ) {
            return produceDatabaseError<Goal[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}
