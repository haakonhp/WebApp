import {Prisma, PrismaClient} from "@prisma/client";
import {produceDatabaseError} from "@/features/HelperFeatures/serviceFunctions/prismaKnownErrorSwitch";
import {errorCodes} from "@/types/errorCodes";
import type {databaseResult} from "@/types/DatatransferTypes";

const prismaLocal = new PrismaClient()

export const addSport = async(prisma: PrismaClient = prismaLocal, sportInput: string): Promise<databaseResult<string>> => {
    try {
        const sport = await prisma.sports.create({
            data: {
                sport: sportInput
            }
        })
        return {success: true, data: sport.sport}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<string>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getSports = async(prisma: PrismaClient = prismaLocal): Promise<databaseResult<string[]>> => {
    try {
        const sports = await prisma.sports.findMany({})
        return {success: true, data: sports.map((sport) => sport.sport)}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<string[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}
