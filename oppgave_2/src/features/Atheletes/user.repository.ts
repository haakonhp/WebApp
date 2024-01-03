import {Prisma, PrismaClient} from "@prisma/client";
import {produceDatabaseError} from "@/features/HelperFeatures/serviceFunctions/prismaKnownErrorSwitch";
import type {UserChange} from "@/types/contextTypes";
import {errorCodes} from "@/types/errorCodes";
import type {Meta, MetaIdentifiable, User, UserMeta, UserMetaFrontEnd} from "@/types/user";
import type {databaseResult} from "@/types/DatatransferTypes";

const prismaLocal = new PrismaClient()

export const retrieveSingleUser = async (id: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<User>> => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                userId: id
            }
        })
        return {success: true, data: user as User}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<User>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const deleteSingleUser = async (id: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<User>> => {
    try {
        const user = await prisma.user.delete({
            where: {
                userId: id
            }
        })
        return {success: true, data: user as User}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<User>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}


export const updateSingleUser = async (userChangeValues: UserChange, prisma: PrismaClient = prismaLocal): Promise<databaseResult<User>> => {
    try {
        const user = await prisma.user.update({
            where: {
                userId:userChangeValues.userId
            },
            data: {
                ...userChangeValues
            }
        })
        return {success: true, data: user as User}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<User>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const createSingleUser = async (singleUser: User, prisma: PrismaClient = prismaLocal): Promise<databaseResult<User>> => {
    try {
        const user = await prisma.user.create({
            data: {
                id: singleUser.id,
                userId: singleUser.userId,
                gender: singleUser.gender,
                sportType: {
                    connect: {
                        sport: singleUser.sport
                    }
                }
            }
        })
        return {success: true, data: user as User}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<User>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }}


export const createSingleUserWithMeta = async (singleUser: UserMeta, prisma: PrismaClient = prismaLocal): Promise<databaseResult<User>> => {
    try {
        const user = await prisma.user.create({
            data: {
                id: singleUser.id,
                userId: singleUser.userId,
                gender: singleUser.gender,
                metaHistory: {
                    create: {
                        ...singleUser.meta
                    }
                },
                sportType: {
                    connect: {
                        sport: singleUser.sport
                    }
                }
            },
        });
        return {success: true, data: user as User}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<User>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}



export const retrieveAllUsers = async (prisma: PrismaClient = prismaLocal): Promise<databaseResult<User[]>> => {
    try {
        const users = await prisma.user.findMany({})

        if (!users.length) {
            return {success: true, data: null, error: errorCodes.NO_CONTENT}
        }
        return {success: true, data: users as User[]}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<User[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}    }
}

export const getUserWithNewestMeta = async (id: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<UserMetaFrontEnd>> => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                userId: id
            },
            include: {
                metaHistory: {
                    orderBy: {
                        creation_time: 'desc',
                    },
                    take: 1
                }
            }
        })
        if (!user) {
            return {success: false, data: null, error: errorCodes.ELEMENT_DOES_NOT_EXIST}
        }
        return {success: true, data: user as UserMetaFrontEnd}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<UserMetaFrontEnd>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }

}
export const retrieveMetaDataForUser = async (id: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<Meta[]>> => {
    try {
        const metadata = await prisma.userExtendedMeta.findMany({
            where: {
                userId: id
            }
        })
        return {success: true, data: metadata}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<Meta[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const retrieveNewestMetaDataForUser = async (id: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<Meta>> => {
    try {
        const metadataResponse = await prisma.userExtendedMeta.findMany({
            take: 1,
            orderBy: {
                creation_time: 'desc'
            },
            where: {
                userId: id
            }
        })
        const metadata = metadataResponse.pop();
        if (metadata) {
            return {success: true, data: metadata}
        }
        return {success: false, data: null, error: errorCodes.ELEMENT_DOES_NOT_EXIST}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<Meta>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}


export const createMetadataForUser = async (meta: MetaIdentifiable, prisma: PrismaClient = prismaLocal): Promise<databaseResult<MetaIdentifiable>> => {
    try {
        const metadata = await prisma.userExtendedMeta.create({
            data: {
                heartrate: meta.heartrate,
                watt: meta.watt,
                speed: meta.speed,
                User: {
                    connect: {
                        userId: meta.userId
                    }
                }
            }
        })
        return {success: true, data: metadata}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<MetaIdentifiable>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

