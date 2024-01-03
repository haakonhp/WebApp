import {errorCodes} from "@/types/errorCodes";
import {type serviceResult} from "@/types/DatatransferTypes";

export function produceFriendlyError<T>(errorCode: errorCodes, itemName: string, dbCause: string | undefined): serviceResult<T> {
    switch (errorCode) {
        case errorCodes.ELEMENT_DOES_NOT_EXIST:
            return {
                success: false,
                data: null,
                errorDescription: `Element of type ${itemName} does not exist..`,
                error: errorCodes.ELEMENT_DOES_NOT_EXIST,
                dbCause: dbCause ?? "Unknown"
            }
        case errorCodes.DUPLICATE_DATABASE_ENTRY:
            return {
                success: false,
                data: null,
                errorDescription: `Duplicate attribute entry, please retry with a different ${itemName}.`,
                error: errorCodes.DUPLICATE_DATABASE_ENTRY,
                dbCause:  dbCause ?? "Unknown"
            }
        case errorCodes.JOINING_ERROR:
            return {
                success: false,
                data: null,
                errorDescription: `Error joining attribute to ${itemName}.`,
                error: errorCodes.JOINING_ERROR,
                dbCause:  dbCause ?? "Unknown"
            }
        case errorCodes.VALIDATION_ERROR:
            return {
                success: false,
                data: null,
                errorDescription: `Error validating attribute when creating ${itemName}.`,
                error: errorCodes.VALIDATION_ERROR,
                dbCause:  dbCause ?? "Unknown"
            }
        case errorCodes.NO_CONTENT:
            return {
                success: false,
                data: null,
                errorDescription: `Fetching elements of type ${itemName} yielded no result.`,
                error: errorCodes.NO_CONTENT,
                dbCause:  dbCause ?? "Unknown"
            }
        case errorCodes.ATTRIBUTES_CLASHING:
            return {
                success: false,
                data: null,
                errorDescription: `Updating element of type ${itemName} with current attributes is disallowed.`,
                error: errorCodes.ATTRIBUTES_CLASHING,
                dbCause: dbCause ?? "Unknown"
            }
        case errorCodes.LACKING_PERFORMANCE_DATA:
            return {
                success: false,
                data: null,
                errorDescription: `Creating an activity without performance data is disallowed.`,
                error: errorCodes.LACKING_PERFORMANCE_DATA,
                dbCause: dbCause ?? "Unknown"
            }
    }
    return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
}