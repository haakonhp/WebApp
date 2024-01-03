import {produceFriendlyError} from "@/features/HelperFeatures/serviceFunctions/serviceErrorSwitch";
import {getSports} from "@/features/Sports/sports.repository";
import type {serviceResult} from "@/types/DatatransferTypes";

export const handleGetAllSports = async(): Promise<serviceResult<string[]>> => {
    const sports = await getSports();

    if (sports.error) {
        return produceFriendlyError<string[]>(sports.error, "Template", sports.dbCause)
    }

    return {success: true, data: sports.data}
}