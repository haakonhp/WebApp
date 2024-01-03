import {
    addActivity,
    addInterval,
    deleteActivity,
    getActiveIntervalsFromTemplateByUser, getActiveIntervalsFromTemplateByUserSelectedIds,
    getActivitiesByUserId,
    getActivity,
    getActivityWithConnectedData, getActivityWithReports,
    getAggregateFromActiveIntervals,
    getAggregateFromActiveIntervalsGrouped, getAggregateFromActiveIntervalsGroupedSelected,
    getAllActiveActivitiesFromTemplate,
    getAllActivities, getIntervalCount,
    getIntervalsByActivityId, getOutdatedActivities,
    getUserActivitiesByTemplateIdWithCount,
    updateActivityChallenge, updateInterval
} from "@/features/Activities/activities.repository";
import {produceFriendlyError} from "@/features/HelperFeatures/serviceFunctions/serviceErrorSwitch";
import {ArrayToCSV, CSVToArray} from "@/features/HelperFeatures/serviceFunctions/TagCSVToArrayMapper";
import {addQuestion} from "@/features/Questions/questions.repository";
import {errorCodes} from "@/types/errorCodes";
import type {ActivityInsert, ActivityResponse, ActivityUpdate, userActivityByTemplate} from "@/types/activity";
import type {analysisAggregate, analysisAggregateGrouped} from "@/types/analysis";
import type {Interval, IntervalInsert, IntervalUpdate} from "@/types/interval";
import type {serviceResult} from "@/types/DatatransferTypes";
import {handleCetIntensityZonesById} from "@/features/Atheletes/user.service";

async function processRecursiveRequest(activity: ActivityInsert) {
    const {goalId, ...activityData} = activity
    const returnedActivity = await addActivity(activityData);

    if (returnedActivity.error) {
        return produceFriendlyError<ActivityResponse>(returnedActivity.error, "Activity", returnedActivity.dbCause)
    }

    if (!returnedActivity.data) {
        return produceFriendlyError<ActivityResponse>(errorCodes.NO_CONTENT, "Activity", returnedActivity.dbCause)
    }

    const returnedActivityConnect = returnedActivity.data.goalId;
    if (activity.intervals) {
        const baseNumber = await getIntervalCount(returnedActivityConnect);
        const baseNumberAwaited = baseNumber.data ?? 0

        await Promise.all(activity.intervals.map(async (interval, index) => {
            const {id, ...intervalData} = interval
            await addInterval({...intervalData, connectedActivity: returnedActivityConnect}, (baseNumberAwaited + index))
        }));
    }
    if (activity.questions) {
        await Promise.all(activity.questions.map(async (question) => {
            const {id, ...questionData} = question
            await addQuestion({...questionData, connectedActivity: returnedActivityConnect})
        }));
    }
    return {success: true, data: returnedActivity.data}
}

export const processReturnableStatuses = (): string[] => {
    return ["low", "normal", "high"];
}

export const handleCreateActivity = async (activity: ActivityInsert): Promise<serviceResult<ActivityResponse>> => {
    activity.slug = activity.name.toLowerCase().replaceAll(" ", "-")

    if (activity.tags) {
        activity.tagsStringable = ArrayToCSV(activity.tags)
    }

    if (activity.personalGoalId && activity.tournamentId) {
        return produceFriendlyError<ActivityResponse>(errorCodes.ATTRIBUTES_CLASHING, "Athlete", "")
    }

    activity.tournamentId = !activity.personalGoalId ? activity.tournamentId : null
    activity.personalGoalId = !activity.tournamentId ? activity.personalGoalId : null
    const intensityMap = await handleCetIntensityZonesById(activity.userId);


    if(!intensityMap.data) {
        return produceFriendlyError<ActivityResponse>(errorCodes.LACKING_PERFORMANCE_DATA, "Athlete", "")
    }

    const intervalsWithGoals = activity.intervals?.map((interval) => {
        const intensityGoal = Math.min(interval.intensity,4);
        interval.heartrateGoal = activity.heartrateChecked ? intensityMap.data?.heartrate?.at(intensityGoal) : null
        interval.speedGoal = activity.speedChecked ? intensityMap.data?.speed?.at(intensityGoal) : null
        interval.wattGoal = activity.wattChecked ? intensityMap.data?.watt?.at(intensityGoal) : null
        interval.perceivedIntensityGoal = activity.intensityChecked ? intensityMap.data?.intensity?.at(intensityGoal) : null
        return interval
    })
    if(!intervalsWithGoals) {
        return produceFriendlyError<ActivityResponse>(errorCodes.GENERIC_ERROR, "Athlete", "")
    }
    activity.intervals = intervalsWithGoals;

    return await processRecursiveRequest(activity);
}

export const handleUpdateActivityChallenge = async (activity: ActivityUpdate): Promise<serviceResult<ActivityResponse>> => {
    if (activity.personalGoalId && activity.tournamentId) {
        return produceFriendlyError<ActivityResponse>(errorCodes.ATTRIBUTES_CLASHING, "Athlete", "")
    }

    activity.tournamentId = !activity.personalGoalId ? activity.tournamentId : null
    activity.personalGoalId = !activity.tournamentId ? activity.personalGoalId : null

    const activityResponse = await updateActivityChallenge(activity);

    if (activityResponse.error) {
        return produceFriendlyError<ActivityResponse>(activityResponse.error, "Athlete", activityResponse.dbCause)
    }
    return {success: true, data: activityResponse.data}
}

export const handleDeleteActivity = async (id: string): Promise<serviceResult<ActivityResponse>> => {
    const activity = await deleteActivity(id);
    if (activity.error) {
        return produceFriendlyError<ActivityResponse>(activity.error, "Athlete", activity.dbCause)
    }
    return {success: true, data: activity.data}
}

export const handleCreateInterval = async (interval: IntervalInsert): Promise<serviceResult<Interval>> => {
    const intervalResponse = await addInterval(interval);

    if (intervalResponse.error) {
        return produceFriendlyError<Interval>(intervalResponse.error, "Interval", intervalResponse.dbCause)
    }

    return {success: true, data: intervalResponse.data}
}

export const handleUpdateInterval = async (interval: IntervalUpdate): Promise<serviceResult<Interval>> => {
    const intervalResponse = await updateInterval(interval);

    if (intervalResponse.error) {
        return produceFriendlyError<Interval>(intervalResponse.error, "Interval", intervalResponse.dbCause)
    }

    return {success: true, data: intervalResponse.data}
}

export const handleGetActiveActivitiesFromTemplate = async (templateId: string): Promise<serviceResult<ActivityResponse[]>> => {
    const returnableStatus = processReturnableStatuses()
    const activities = await getAllActiveActivitiesFromTemplate(templateId, returnableStatus);

    if (activities.error) {
        return produceFriendlyError<ActivityResponse[]>(activities.error, "Activity", activities.dbCause)
    }

    return {success: true, data: activities.data}
}

export const handleGetUserActivitiesByTemplateId = async (templateId: string, userId: string): Promise<serviceResult<userActivityByTemplate[]>> => {
    const returnableStatus = processReturnableStatuses()
    const activities = await getUserActivitiesByTemplateIdWithCount(templateId, returnableStatus, userId);

    if (activities.error) {
        return produceFriendlyError<userActivityByTemplate[]>(activities.error, "Activity", activities.dbCause)
    }

    return {success: true, data: activities.data}
}


export const handleGetActiveIntervalsFromTemplateByUser = async (templateId: string, userId: string): Promise<serviceResult<ActivityResponse[]>> => {
    const returnableStatus = processReturnableStatuses()
    const activities = await getActiveIntervalsFromTemplateByUser(templateId, userId, returnableStatus);

    if (activities.error) {
        return produceFriendlyError<ActivityResponse[]>(activities.error, "Activity", activities.dbCause)
    }

    return {success: true, data: activities.data}
}

export const handleGetActiveIntervalsFromTemplateByUserSelected = async (templateId: string, userId: string, selectedIds: string[]): Promise<serviceResult<ActivityResponse[]>> => {
    const returnableStatus = processReturnableStatuses()
    const activities = await getActiveIntervalsFromTemplateByUserSelectedIds(templateId, userId, returnableStatus, selectedIds);

    if (activities.error) {
        return produceFriendlyError<ActivityResponse[]>(activities.error, "Activity", activities.dbCause)
    }

    return {success: true, data: activities.data}
}

export const handleAggregateFromActiveIntervals = async (templateId: string, userId: string): Promise<serviceResult<analysisAggregate>> => {
    const returnableStatus = processReturnableStatuses()
    const activities = await getAggregateFromActiveIntervals(templateId, userId, returnableStatus);

    if (activities.error) {
        return produceFriendlyError<analysisAggregate>(activities.error, "Activity", activities.dbCause)
    }

    return {success: true, data: activities.data}
}

export const handleAggregateFromActiveIntervalsGrouped = async (templateId: string, userId: string): Promise<serviceResult<analysisAggregateGrouped[]>> => {
    const returnableStatus = processReturnableStatuses()
    const activities = await getAggregateFromActiveIntervalsGrouped(templateId, userId, returnableStatus);

    if (activities.error) {
        return produceFriendlyError<analysisAggregateGrouped[]>(activities.error, "Activity", activities.dbCause)
    }

    return {success: true, data: activities.data}
}

export const handleAggregateFromActiveIntervalsGroupedSelected = async (templateId: string, userId: string, selectedIds: string[]): Promise<serviceResult<analysisAggregateGrouped[]>> => {
    const returnableStatus = processReturnableStatuses()
    const activities = await getAggregateFromActiveIntervalsGroupedSelected(templateId, userId, returnableStatus, selectedIds);

    if (activities.error) {
        return produceFriendlyError<analysisAggregateGrouped[]>(activities.error, "Activity", activities.dbCause)
    }

    return {success: true, data: activities.data}
}


export const handleGetAllActivities = async (): Promise<serviceResult<ActivityResponse[]>> => {
    const activities = await getAllActivities();

    activities.data?.map((activity) => activity.tags = CSVToArray(activity.tagsStringable))
    if (activities.error) {
        return produceFriendlyError<ActivityResponse[]>(activities.error, "Activity", activities.dbCause)
    }

    return {success: true, data: activities.data}
}

export const handleGetAllActivitiesFromUserId = async (userId: string): Promise<serviceResult<ActivityResponse[]>> => {
    const activities = await getActivitiesByUserId(userId);
    if (activities.error) {
        return produceFriendlyError<ActivityResponse[]>(activities.error, "Activity", activities.dbCause)
    }

    return {success: true, data: activities.data}
}


export const handleDuplicateActivityFromActivityId = async (activityId: string): Promise<serviceResult<ActivityResponse>> => {
    const activity = await getActivityWithConnectedData(activityId);

    if (activity.error) {
        return produceFriendlyError<ActivityResponse>(activity.error, "Activity", activity.dbCause)
    }
    // We shouldn't reach this point, as a lack of data should come with an accompanying error which is handled further up,
    // but we need to narrow down the result to play nicely with typescript.
    if (!activity.data) {
        return {success: false, data: null}
    }
    return await processRecursiveRequest(activity.data as ActivityInsert);
}

export const handleGetAllIntervalsFromActivity = async (activityId: string): Promise<serviceResult<Interval[]>> => {
    const intervals = await getIntervalsByActivityId(activityId);
    if (intervals.error) {
        return produceFriendlyError<Interval[]>(intervals.error, "Interval", intervals.dbCause)
    }

    return {success: true, data: intervals.data}
}

export const handleGetActivityFromActivityId = async (goalId: string): Promise<serviceResult<ActivityResponse>> => {
    const activity = await getActivity(goalId);
    if (activity.error) {
        return produceFriendlyError<ActivityResponse>(activity.error, "Activity", activity.dbCause)
    }

    return {success: true, data: activity.data}
}

export const handleGetOutdatedActivities = async (): Promise<serviceResult<ActivityResponse[]>> => {
    const activities = await getOutdatedActivities();
    if (activities.error) {
        return produceFriendlyError<ActivityResponse[]>(activities.error, "Activity", activities.dbCause)
    }

    return {success: true, data: activities.data}
}

export const handleGetActivityFromActivityIdWithReports = async (goalId: string): Promise<serviceResult<ActivityResponse>> => {
    const activity = await getActivityWithReports(goalId);
    if (activity.error) {
        return produceFriendlyError<ActivityResponse>(activity.error, "Activity", activity.dbCause)
    }

    return {success: true, data: activity.data}
}