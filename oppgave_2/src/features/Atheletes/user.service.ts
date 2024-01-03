import {updateSingleUser, createMetadataForUser, createSingleUser, createSingleUserWithMeta, deleteSingleUser, getUserWithNewestMeta, retrieveAllUsers, retrieveMetaDataForUser, retrieveNewestMetaDataForUser} from "@/features/Atheletes/user.repository";
import {produceFriendlyError} from "@/features/HelperFeatures/serviceFunctions/serviceErrorSwitch";
import type { UserChange} from "@/types/contextTypes";
import {errorCodes} from "@/types/errorCodes";
import type {intensityZoneReport, Meta, MetaIdentifiable, User, UserMeta, UserMetaFrontEnd, UserPossiblyMeta} from "@/types/user";
import type {serviceResult} from "@/types/DatatransferTypes";

export const handleGetUserWithMetaById = async (id: string): Promise<serviceResult<UserMetaFrontEnd>> => {
    const user = await getUserWithNewestMeta(id);
    if (user.error) {
        return produceFriendlyError<UserMetaFrontEnd>(user.error, "Athlete", user.dbCause)
    }
    return {success: true, data: user.data}
}

export const handleUpdateUser = async (changeInfo: UserChange): Promise<serviceResult<User>> => {
    const user = await updateSingleUser(changeInfo);
    if (user.error) {
        return produceFriendlyError<User>(user.error, "Athlete", user.dbCause)
    }
    return {success: true, data: user.data}
}

export const handleDeleteUser =  async (id: string): Promise<serviceResult<User>> => {
    const user = await deleteSingleUser(id);
    if (user.error) {
        return produceFriendlyError<User>(user.error, "Athlete", user.dbCause)
    }
    return {success: true, data: user.data}
}

export const handleGetAllUsers = async (): Promise<serviceResult<User[]>> => {
    const users = await retrieveAllUsers();
    if (users.error) {
        return produceFriendlyError<User[]>(users.error, "Athlete", users.dbCause)
    }

    return {success: true, data: users.data}
}

export const handleGetUserMetaById = async (id: string): Promise<serviceResult<Meta[]>> => {
    const metadata = await retrieveMetaDataForUser(id);

    if (metadata.error) {
        return produceFriendlyError<Meta[]>(metadata.error, "Athlete", metadata.dbCause)
    }

    return {success: true, data: metadata.data}
}

export const handleGetNewestUserMetaById = async (id: string): Promise<serviceResult<Meta>> => {
    const metadata = await retrieveNewestMetaDataForUser(id);

    if (metadata.error) {
        return produceFriendlyError<Meta>(metadata.error, "Athlete", metadata.dbCause)
    }

    return {success: true, data: metadata.data}
}

export const handleCetIntensityZonesById = async (id: string): Promise<serviceResult<intensityZoneReport>> => {
    const metadataResponse = await retrieveNewestMetaDataForUser(id);

    if (metadataResponse.error) {
        return produceFriendlyError<intensityZoneReport>(metadataResponse.error, "Athlete", metadataResponse.dbCause)
    }
    if (!metadataResponse.data) {
        return {success: false, data: null, error: errorCodes.NO_CONTENT}
    }
    const metadata = metadataResponse.data
    const percentages = [0.5, 0.6, 0.7, 0.8, 0.9];
    const intensityZones = {intensity: [0], watt: [0], heartrate: [0], speed: [0]};

    intensityZones.intensity = percentages.map((percentage) => percentage * 100)

    if (metadata.watt) {
        intensityZones.watt = percentages.map((percentage) => Math.floor(metadata.watt * percentage));
    }
    if (metadata.heartrate) {
        intensityZones.heartrate = percentages.map((percentage) => Math.floor(metadata.heartrate * percentage));
    }
    if (metadata.speed) {
        intensityZones.speed = percentages.map((percentage) => Math.floor(metadata.speed * percentage));
    }

    return {success: true, data: intensityZones}
}


export const handleCreateUser = async (user: UserPossiblyMeta): Promise<serviceResult<User>> => {
    const returnedUserResponse = user.meta ? await createSingleUserWithMeta(user as UserMeta) : await createSingleUser(user);
    if (returnedUserResponse.error) {
        return produceFriendlyError<User>(returnedUserResponse.error, "Athlete", returnedUserResponse.dbCause)
    }
    return {success: true, data: returnedUserResponse.data}
}

export const handleCreateUserMetaData = async (meta: MetaIdentifiable): Promise<serviceResult<MetaIdentifiable>> => {
    const returnedMetaResponse = await createMetadataForUser(meta);

    if (returnedMetaResponse.error) {
        return produceFriendlyError<MetaIdentifiable>(returnedMetaResponse.error, "Metadata", returnedMetaResponse.dbCause)
    }
    return {success: true, data: returnedMetaResponse.data}
}