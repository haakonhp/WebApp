import {Prisma} from "@prisma/client"

import {type databaseResult} from "@/types/DatatransferTypes"
import {errorCodes} from "@/types/errorCodes"

export function produceDatabaseError<T>(
    error:
        | Prisma.PrismaClientKnownRequestError
        | Prisma.PrismaClientValidationError,
) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return handleKnownRequestError<T>(error)
    }
    return handleClientValidationError<T>(error)
}

function extractCause(error: Prisma.PrismaClientKnownRequestError) {
    if (error.meta) {
        const offendingCause = Object.values(error.meta)[0] as string | string[]
        if ((typeof offendingCause != "string") && !(Array.isArray(offendingCause))) {
            return ""
        }
        if (Array.isArray(offendingCause)) {
            return offendingCause.toString().replaceAll(",", " & ")
        }
        const regexExtracted = offendingCause.match("\\'(.*?)\\'");
        if (!regexExtracted) {
            return ""
        }
        return regexExtracted[0].replaceAll("'", "")
    }
    return ""
}

export function handleKnownRequestError<T>(error: Prisma.PrismaClientKnownRequestError): databaseResult<T> {
    const cause = extractCause(error)

    switch (error.code) {
        case "P2002":
            return {success: false, data: null, error: errorCodes.DUPLICATE_DATABASE_ENTRY, dbCause: cause}
        case "P2003":
            return {success: false, data: null, error: errorCodes.JOINING_ERROR, dbCause: cause}
        case "P2025":
            return {success: false, data: null, error: errorCodes.JOINING_ERROR, dbCause: cause}
    }
    return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
}

export function handleClientValidationError<T>(
    error: Prisma.PrismaClientValidationError,
): databaseResult<T> {
    return {success: false, data: null, error: errorCodes.VALIDATION_ERROR}
}
