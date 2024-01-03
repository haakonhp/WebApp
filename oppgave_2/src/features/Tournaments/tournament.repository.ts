import {Prisma, PrismaClient} from "@prisma/client"

import {produceDatabaseError} from "@/features/HelperFeatures/serviceFunctions/prismaKnownErrorSwitch"
import {errorCodes} from "@/types/errorCodes";
import type {Tournament} from "@/types/tournament";
import type {databaseResult} from "@/types/DatatransferTypes";

const prismaLocal = new PrismaClient()

export const createSingleTournament = async (tournamentInput: Tournament, prisma: PrismaClient = prismaLocal,): Promise<databaseResult<Tournament>> => {
    const {userId, sport, ...tournamentData} = tournamentInput
    try {
        const tournament = await prisma.tournament.create({
            data: {
                ...tournamentData,
                user: {
                    connect: {
                        userId: userId
                    }
                },
                sportType: {
                    connect: {
                        sport: sport
                    }
                }
            },
        })
        return {success: true, data: tournament}
    } catch (e) {
        if (
            e instanceof Prisma.PrismaClientKnownRequestError ||
            e instanceof Prisma.PrismaClientValidationError
        ) {
            return produceDatabaseError<Tournament>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getTournament = async (
    id: string,
    prisma: PrismaClient = prismaLocal,
): Promise<databaseResult<Tournament>> => {
    try {
        const tournament = await prisma.tournament.findUnique({
            where: {
                id: id,
            },
        })
        return {success: true, data: tournament}
    } catch (e) {
        if (
            e instanceof Prisma.PrismaClientKnownRequestError ||
            e instanceof Prisma.PrismaClientValidationError
        ) {
            return produceDatabaseError<Tournament>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getTournaments = async (
    prisma: PrismaClient = prismaLocal,
): Promise<databaseResult<Tournament[]>> => {
    try {
        const tournaments = await prisma.tournament.findMany({})
        return {success: true, data: tournaments}
    } catch (e) {
        if (
            e instanceof Prisma.PrismaClientKnownRequestError ||
            e instanceof Prisma.PrismaClientValidationError
        ) {
            return produceDatabaseError<Tournament[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getTournamentsByUserId = async (userId: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<Tournament[]>> => {
    try {
        const tournaments = await prisma.tournament.findMany({
            where: {
                userId: userId,
            },
        })

        if (!tournaments.length) {
            return {success: false, data: null, error: errorCodes.NO_CONTENT}
        }

        return {success: true, data: tournaments}
    } catch (e) {
        if (
            e instanceof Prisma.PrismaClientKnownRequestError ||
            e instanceof Prisma.PrismaClientValidationError
        ) {
            return produceDatabaseError<Tournament[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}
