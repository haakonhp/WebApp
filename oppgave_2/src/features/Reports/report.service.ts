import {produceFriendlyError} from "@/features/HelperFeatures/serviceFunctions/serviceErrorSwitch";
import {createOrReplaceSingleReport, getReportsByUserId} from "@/features/Reports/report.repository";
import type {Report} from "@/types/baseTypes";
import type {serviceResult} from "@/types/DatatransferTypes";

export const handleCreateOrReplaceReport = async (report: Report): Promise<serviceResult<Report>> => {
    const returnedReportResult = await createOrReplaceSingleReport(report);

    if(returnedReportResult.error) {
        return produceFriendlyError<Report>(returnedReportResult.error, "Report", returnedReportResult.dbCause)
    }
    return {success: true, data: returnedReportResult.data}
}

export const handleGetReportsById = async (userId: string): Promise<serviceResult<Report[]>> => {
    const returnedReportResult = await getReportsByUserId(userId);

    if(returnedReportResult.error) {
        return produceFriendlyError<Report[]>(returnedReportResult.error, "Report", returnedReportResult.dbCause)
    }
    return {success: true, data: returnedReportResult.data}
}