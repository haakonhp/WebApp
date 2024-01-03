import {produceNextResponseError} from "@/features/HelperFeatures/serviceFunctions/controllerErrorSwitch";
import {NextResponse} from "next/server";
import {handleGetAllSports} from "@/features/Sports/sports.service";

export const resolveGetAllSports = async () => {
    const sports = await handleGetAllSports();

    if (sports.error) {
        return produceNextResponseError(sports.error, sports.dbCause);
    }

    return NextResponse.json({success: true, data: sports}, {status: 200})
}