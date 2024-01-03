import {Prisma, PrismaClient} from "@prisma/client"
import {createSingleUserWithMeta} from "@/features/Atheletes/user.repository";
import {produceDatabaseError} from "@/features/HelperFeatures/serviceFunctions/prismaKnownErrorSwitch";
import {addQuestion} from "@/features/Questions/questions.repository";
import {addInterval, addActivity} from "@/features/Activities/activities.repository";
import type {userData} from "@/types/JSONImportTypes";
import {errorCodes} from "@/types/errorCodes";
import type {User} from "@/types/user";
import type {ActivityInsert, ActivityResponse} from "@/types/activity";
import type {Question, QuestionInsert} from "@/types/question";
import type {Interval, IntervalInsert} from "@/types/interval";
import type {Tag, TagInsert} from "@/types/tag";
import type {databaseResult} from "@/types/DatatransferTypes";

const prismaLocal = new PrismaClient()

export const wipeDatabase = async (prisma: PrismaClient = prismaLocal) => {
    await prisma.templateQuestion.deleteMany({})
    await prisma.template.deleteMany({})
    await prisma.personalGoal.deleteMany({})
    await prisma.tournament.deleteMany({})
    await prisma.user.deleteMany({})
    await prisma.sports.deleteMany({})
}

export const createUser = async (singleUser: userData, prisma: PrismaClient = prismaLocal): Promise<databaseResult<User>> => {
    return await createSingleUserWithMeta(singleUser, prisma)
}

export const createActivity = async (singleActivity: ActivityInsert, prisma: PrismaClient = prismaLocal): Promise<databaseResult<ActivityResponse>> => {
    return await addActivity(singleActivity, prisma)
}

export const createQuestion = async (singleQuestion: QuestionInsert, prisma: PrismaClient = prismaLocal): Promise<databaseResult<Question>> => {
    return await addQuestion(singleQuestion, prisma)
}

export const createInterval = async (singleInterval: IntervalInsert, prisma: PrismaClient = prismaLocal): Promise<databaseResult<Interval>> => {
    return await addInterval(singleInterval, prisma)
}

export const createTag = async (singleTag: TagInsert, prisma: PrismaClient = prismaLocal): Promise<databaseResult<Tag>> => {
    try {
        const tag = await prisma.userActivityTags.create({
            data: {
                tag: singleTag.tag,
                UserActivity: {
                    connect: {
                        goalId: singleTag.connectedActivity
                    }
                }
            }
        })
        return {success: true, data: tag}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<Tag>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getTag = async (id: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<Tag>> => {
    try {
        const tag = await prisma.userActivityTags.findUnique({
            where: {
                tagId: id
            }
        })
        return {success: true, data: tag}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<Tag>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}    }
}

export const getTags = async (prisma: PrismaClient = prismaLocal): Promise<databaseResult<Tag[]>> => {
    try {
        const tag = await prisma.userActivityTags.findMany({})
        return {success: true, data: tag}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<Tag[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}    }
}



