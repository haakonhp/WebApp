import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {
    handleCreateUser,
    handleGetNewestUserMetaById,
    handleCreateUserMetaData,
    handleGetAllUsers,
    handleGetUserWithMetaById,
    handleGetUserMetaById, handleCetIntensityZonesById, handleUpdateUser, handleDeleteUser
} from "@/features/Atheletes/user.service";
import {produceNextResponseError} from "@/features/HelperFeatures/serviceFunctions/controllerErrorSwitch";
import {extractJSONData} from "@/features/HelperFeatures/serviceFunctions/JSONDataExtraction";
import {type resourceRequestById} from "@/types/contextTypes";
import {type MetaIdentifiable, type UserPossiblyMeta} from "@/types/user";

export const resolveGetUserById = async (request: NextRequest, context: resourceRequestById): Promise<NextResponse> => {
    if (!context.params.id) {
        return NextResponse.json({success: false, data: null}, {status: 400})
    }
    const athlete = await handleGetUserWithMetaById(context.params.id);

    if(athlete.error) {
        return produceNextResponseError(athlete.error, athlete.dbCause);
    }
    

    return NextResponse.json({success: true, data: athlete}, {status: 200})
}

export const resolveDeleteUser = async (request: NextRequest, context: resourceRequestById): Promise<NextResponse> => {
    if (!context.params.id) {
        return NextResponse.json({success: false, data: null}, {status: 400})
    }
    const deleteResponse = await handleDeleteUser(context.params.id);

    if(deleteResponse.error) {
        return produceNextResponseError(deleteResponse.error, deleteResponse.dbCause);
    }
    return NextResponse.json({success: true, data: deleteResponse}, {status: 200})
}

export const resolveUpdateUser = async (request: NextRequest): Promise<NextResponse> => {
    if (request.headers.get("content-type") !== "application/json") {
        return NextResponse.json({success: false, data: {error: "Invalid request format, use JSON."}}, {status: 415})
    }

    const createUserResponse = await extractJSONData<UserPossiblyMeta>(request);
    if (!createUserResponse) {
        return NextResponse.json({success: false, data: {error: "JSON Parsing error."}}, {status: 500})
    }

    if (!createUserResponse.userId) {
        return NextResponse.json({success: false, data: {error: "Missing proper attributes for update of User."}}, {status: 400})
    }

    const userResult = await handleUpdateUser(createUserResponse);

    if(userResult.error) {
        return produceNextResponseError(userResult.error, userResult.dbCause);
    }
    return NextResponse.json({success: true, data: userResult}, {status: 200})
}


export const resolveGetAllUsers = async (request: NextRequest): Promise<NextResponse> => {
    const athletes = await handleGetAllUsers();

    if(athletes.error) {
        return produceNextResponseError(athletes.error, athletes.dbCause);
    }

    return NextResponse.json({success: true, data: athletes}, {status: 200})
}


export const resolveGetUserMetaById = async (request: NextRequest, context: resourceRequestById): Promise<NextResponse> => {
    if (!context.params.id) {
        return NextResponse.json({success: false, data: null}, {status: 400})
    }
    const metaArray = await handleGetUserMetaById(context.params.id);

    if(metaArray.error) {
        return produceNextResponseError(metaArray.error, metaArray.dbCause);
    }

    return NextResponse.json({success: true, data: metaArray}, {status: 200})
}

export const resolveGetNewestMetaById = async (request: NextRequest, context: resourceRequestById): Promise<NextResponse> => {
    if (!context.params.id) {
        return NextResponse.json({success: false, data: null}, {status: 400})
    }

    const metadata = await handleGetNewestUserMetaById(context.params.id);

    if(metadata.error) {
        return produceNextResponseError(metadata.error, metadata.dbCause);
    }

    return NextResponse.json({success: true, data: metadata}, {status: 200})
}

export const resolveGetUserIntensityZones = async (request: NextRequest, context: resourceRequestById): Promise<NextResponse> => {
    if (!context.params.id) {
        return NextResponse.json({success: false, data: null}, {status: 400})
    }

    const intensityZoneReport = await handleCetIntensityZonesById(context.params.id);

    if(intensityZoneReport.error) {
        return produceNextResponseError(intensityZoneReport.error, intensityZoneReport.dbCause);
    }

    return NextResponse.json({success: true, data: intensityZoneReport}, {status: 200})
}

export const    resolveCreateUser = async (request: NextRequest): Promise<NextResponse> => {
    if (request.headers.get("content-type") !== "application/json") {
        return NextResponse.json({success: false, data: {error: "Invalid request format, use JSON."}}, {status: 415})
    }

    const createUserResponse = await extractJSONData<UserPossiblyMeta>(request);
    if (!createUserResponse) {
        return NextResponse.json({success: false, data: {error: "JSON Parsing error."}}, {status: 500})
    }
    // User response containing an union of known strings makes ESLint convinced sport is a truthy value, but we don't actually know that at this point.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!createUserResponse.userId || !createUserResponse.gender || !createUserResponse.sport) {
        return NextResponse.json({success: false, data: {error: "Missing proper attributes for User."}}, {status: 400})
    }

    if (createUserResponse.meta && (!createUserResponse.meta.watt || !createUserResponse.meta.heartrate || !createUserResponse.meta.speed)) {
        return NextResponse.json({success: false, data: {error: "Missing proper attributes for Meta."}}, {status: 400})

    }
    const userResult = await handleCreateUser(createUserResponse);

    if(userResult.error) {
        return produceNextResponseError(userResult.error, userResult.dbCause);
    }

    return NextResponse.json({success: true, data: userResult}, {status: 200})
}

export const resolveCreateMetaDataForUser = async (request: NextRequest, context: resourceRequestById): Promise<NextResponse> => {
    if (request.headers.get("content-type") !== "application/json") {
        return NextResponse.json({success: false, data: {error: "Invalid request format, use JSON."}}, {status: 415})
    }

    const createMetaResponse = await extractJSONData<MetaIdentifiable>(request);
    if (!createMetaResponse) {
        return NextResponse.json({success: false, data: {error: "JSON Parsing error."}}, {status: 500})
    }

    createMetaResponse.userId = context.params.id;

    if (!createMetaResponse.userId || !createMetaResponse.speed || !createMetaResponse.heartrate || !createMetaResponse.watt) {
        return NextResponse.json({success: false, data: {error: "Missing proper attributes for User."}}, {status: 400})
    }

    const userResult = await handleCreateUserMetaData(createMetaResponse);

    if(userResult.error) {
        return produceNextResponseError(userResult.error, userResult.dbCause);
    }

    return NextResponse.json({success: true, data: userResult}, {status: 200})
}