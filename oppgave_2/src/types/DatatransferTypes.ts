import type {importedUserData} from "@/types/JSONImportTypes";
import type {errorCodes} from "@/types/errorCodes";

export type pageResponse = {
    pages: number,
    success: boolean,
    hasMore: boolean,
    page: number,
    data: importedUserData
}
export type baseResult<T> = {
    success: boolean,
    data: T | null,
    error?: errorCodes
    dbCause?: string
}
export type serviceResult<T> = baseResult<T> & {
    errorDescription?: string
}
export type databaseResult<T> = baseResult<T>