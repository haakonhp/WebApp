import {
    createActivity, createInterval, createQuestion, createTag,
    createUser,
} from "@/features/ImportHandling/import.repository";
import {ArrayToCSV} from "@/features/HelperFeatures/serviceFunctions/TagCSVToArrayMapper";
import type {importedUserData, userData} from "@/types/JSONImportTypes";
import type {ActivityInsert} from "@/types/activity";
import type {serviceResult} from "@/types/DatatransferTypes";

export const handleImportedData = async (data: importedUserData): Promise<serviceResult<number>> => {
    const result = await Promise.all(data.map(async (userData) => {
        return await handleUsers(userData)
    }))
    const successfulOperations = result.reduce((sum, current) => sum + (current.success ? 1 : 0), 0);
    if (successfulOperations > 0) {
        return {success: true, data: successfulOperations}
    }
    return {success: false, data: 0}
}

export const handleUsers = async (user: userData): Promise<serviceResult<number>> => {
    const returnedUser = await createUser(user);
    if (!returnedUser.data) {
        return {success: false, data: 0}
    }
    // Const narrowing plays nice with typescript and Lambda, just returning early due to missing data
    // will not make typescript consider the data "not null".
    const returnedData = returnedUser.data;

    user.activities.map(async (activity) => await handleActivities({userId: returnedData.userId, tagsStringable: "", ...activity}));
    return {success: true, data: 1}
}

export const handleActivities = async (activity: ActivityInsert): Promise<serviceResult<number>> => {
    if (!activity.name) {
        activity.name = crypto.randomUUID()
    }
    if(!activity.sport) {
        activity.sport = "Unknown";
    }
    activity.slug = activity.name.toLowerCase().replaceAll(" ", "-")

    if(activity.tags) {
    activity.tagsStringable = ArrayToCSV(activity.tags)
    }

    const returnedActivity = await createActivity(activity);

    if (!returnedActivity.data) {
        return {success: false, data: 0}
    }
    const returnedData = returnedActivity.data;
    activity.tags?.map(async tag => {
        await createTag({tag: tag, connectedActivity: returnedData.goalId})
    })
    activity.questions?.map(async question => {
        await createQuestion({...question, connectedActivity: returnedData.goalId})
    })
    activity.intervals?.map(async interval => {
        await createInterval({...interval, connectedActivity: returnedData.goalId})
    })
    return {success: true, data: 1}
}