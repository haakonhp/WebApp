import type {activityFilterList, ActivityInsert, ActivityUpdate} from "@/types/activity"
import type {
    resourceByIdAndTemplate,
    resourceByUserAndTemplate,
    resourceRequestById,
} from "@/types/contextTypes"
import type {IntervalInsert, IntervalUpdate} from "@/types/interval"
import type {NextRequest} from "next/server"
import {NextResponse} from "next/server"

import {
    handleAggregateFromActiveIntervals,
    handleAggregateFromActiveIntervalsGrouped, handleAggregateFromActiveIntervalsGroupedSelected,
    handleCreateActivity,
    handleCreateInterval,
    handleDeleteActivity,
    handleDuplicateActivityFromActivityId,
    handleGetActiveActivitiesFromTemplate,
    handleGetActiveIntervalsFromTemplateByUser, handleGetActiveIntervalsFromTemplateByUserSelected,
    handleGetActivityFromActivityId, handleGetActivityFromActivityIdWithReports,
    handleGetAllActivities,
    handleGetAllActivitiesFromUserId,
    handleGetAllIntervalsFromActivity, handleGetOutdatedActivities,
    handleGetUserActivitiesByTemplateId,
    handleUpdateActivityChallenge, handleUpdateInterval,
} from "@/features/Activities/activities.service"
import {produceNextResponseError} from "@/features/HelperFeatures/serviceFunctions/controllerErrorSwitch"
import {extractJSONData} from "@/features/HelperFeatures/serviceFunctions/JSONDataExtraction"

export const resolveCreateActivity = async (
    request: NextRequest,
): Promise<NextResponse> => {
    if (request.headers.get("content-type") !== "application/json") {
        return NextResponse.json(
            {success: false, data: {error: "Invalid request format, use JSON."}},
            {status: 415},
        )
    }
    const createActivityRequest = await extractJSONData<ActivityInsert>(request)
    if (!createActivityRequest) {
        return NextResponse.json(
            {success: false, data: {error: "JSON Parsing error."}},
            {status: 500},
        )
    }

    const hasBaseAttributes =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        createActivityRequest.date &&
        createActivityRequest.userId &&
        createActivityRequest.name &&
        createActivityRequest.tags &&
        createActivityRequest.sport
    const lacksCheckboxes =
        !createActivityRequest.intensityChecked &&
        !createActivityRequest.speedChecked &&
        !createActivityRequest.heartrateChecked &&
        !createActivityRequest.wattChecked

    if (!hasBaseAttributes || lacksCheckboxes) {
        return NextResponse.json(
            {
                success: false,
                data: {error: "Missing proper attributes for Activity."},
            },
            {status: 400},
        )
    }

    const activityResult = await handleCreateActivity(createActivityRequest)

    if (activityResult.error) {
        return produceNextResponseError(activityResult.error, activityResult.dbCause)
    }

    return NextResponse.json(
        {success: true, data: activityResult},
        {status: 200},
    )
}

export const resolveCreateInterval = async (
    request: NextRequest,
    context: resourceRequestById,
): Promise<NextResponse> => {
    if (request.headers.get("content-type") !== "application/json") {
        return NextResponse.json(
            {success: false, data: {error: "Invalid request format, use JSON."}},
            {status: 415},
        )
    }
    const createIntervalRequest = await extractJSONData<IntervalInsert>(request)
    if (!createIntervalRequest) {
        return NextResponse.json(
            {success: false, data: {error: "JSON Parsing error."}},
            {status: 500},
        )
    }

    if (!createIntervalRequest.connectedActivity) {
        createIntervalRequest.connectedActivity = context.params.id
    }

    const lacksBaseValues =
        !createIntervalRequest.intensity ||
        !createIntervalRequest.duration ||
        !createIntervalRequest.connectedActivity
    const lacksHeartrate =
        !createIntervalRequest.heartrateMin ||
        !createIntervalRequest.heartrateAvg ||
        !createIntervalRequest.heartrateMax
    const lacksSpeed =
        !createIntervalRequest.speedMin ||
        !createIntervalRequest.speedAvg ||
        !createIntervalRequest.speedMax
    const lacksWatt =
        !createIntervalRequest.wattMin ||
        !createIntervalRequest.wattAvg ||
        !createIntervalRequest.wattMax

    if (lacksBaseValues || (lacksSpeed && lacksWatt && lacksHeartrate)) {
        return NextResponse.json(
            {
                success: false,
                data: {error: "Missing proper attributes for Interval."},
            },
            {status: 400},
        )
    }

    const createdIntervalResponse = await handleCreateInterval(
        createIntervalRequest,
    )

    if (createdIntervalResponse.error) {
        return produceNextResponseError(createdIntervalResponse.error, createdIntervalResponse.dbCause)
    }

    return NextResponse.json(
        {success: true, data: createdIntervalResponse},
        {status: 200},
    )
}


export const resolveUpdateInterval = async (
    request: NextRequest,
    context: resourceRequestById,
): Promise<NextResponse> => {
    if (request.headers.get("content-type") !== "application/json") {
        return NextResponse.json(
            {success: false, data: {error: "Invalid request format, use JSON."}},
            {status: 415},
        )
    }

    if (!context.params.id) {
        return NextResponse.json({success: false, data: null}, {status: 400})
    }



    const createIntervalRequest = await extractJSONData<IntervalUpdate>(request)
    if (!createIntervalRequest) {
        return NextResponse.json(
            {success: false, data: {error: "JSON Parsing error."}},
            {status: 500},
        )
    }

    if(!createIntervalRequest.id) {
        createIntervalRequest.id = context.params.id
    }

    const lacksHeartrate =
        !createIntervalRequest.heartrateMin ||
        !createIntervalRequest.heartrateAvg ||
        !createIntervalRequest.heartrateMax
    const lacksSpeed =
        !createIntervalRequest.speedMin ||
        !createIntervalRequest.speedAvg ||
        !createIntervalRequest.speedMax
    const lacksWatt =
        !createIntervalRequest.wattMin ||
        !createIntervalRequest.wattAvg ||
        !createIntervalRequest.wattMax

    if (lacksSpeed && lacksWatt && lacksHeartrate) {
        return NextResponse.json(
            {
                success: false,
                data: {error: "Missing proper attributes for Interval."},
            },
            {status: 400},
        )
    }

    const createdIntervalResponse = await handleUpdateInterval(
        createIntervalRequest,
    )

    if (createdIntervalResponse.error) {
        return produceNextResponseError(createdIntervalResponse.error, createdIntervalResponse.dbCause)
    }

    return NextResponse.json(
        {success: true, data: createdIntervalResponse},
        {status: 200},
    )
}

export const resolveGetActiveActivitiesFromTemplate = async (
    request: NextRequest,
    context: resourceRequestById,
): Promise<NextResponse> => {
    if (!context.params.id) {
        return NextResponse.json({success: false, data: null}, {status: 400})
    }

    const activities = await handleGetActiveActivitiesFromTemplate(
        context.params.id,
    )

    if (activities.error) {
        return produceNextResponseError(activities.error, activities.dbCause)
    }

    return NextResponse.json({success: true, data: activities}, {status: 200})
}



export const resolveGetActiveIntervalsFromTemplateByUser = async (
    request: NextRequest,
    context: resourceByUserAndTemplate,
): Promise<NextResponse> => {
    if (!context.params.user || !context.params.template) {
        return NextResponse.json({success: false, data: null}, {status: 400})
    }

    const activities = await handleGetActiveIntervalsFromTemplateByUser(
        context.params.template,
        context.params.user,
    )

    if (activities.error) {
        return produceNextResponseError(activities.error, activities.dbCause)
    }

    return NextResponse.json({success: true, data: activities}, {status: 200})
}

export const resolveGetActiveIntervalsFromTemplateByUserSelected = async (
    request: NextRequest,
    context: resourceByUserAndTemplate,
): Promise<NextResponse> => {
    if (!context.params.user || !context.params.template) {
        return NextResponse.json({success: false, data: {error: "Missing parameters."}}, {status: 400})
    }

    if (request.headers.get("content-type") !== "application/json") {
        return NextResponse.json(
            {success: false, data: {error: "Invalid request format, use JSON."}},
            {status: 415},
        )
    }
    const filterList = await extractJSONData<activityFilterList>(request)
    if(!filterList) {
        return NextResponse.json({success: false, data: {error: "Missing body attribute 'filterList'."}}, {status: 400})
    }


    const activities = await handleGetActiveIntervalsFromTemplateByUserSelected(
        context.params.template,
        context.params.user,
        filterList.filterList
    )

    if (activities.error) {
        return produceNextResponseError(activities.error, activities.dbCause)
    }

    return NextResponse.json({success: true, data: activities}, {status: 200})
}

export const resolveGetActivitiesByTemplateAndUserId = async (
    request: NextRequest,
    context: resourceByIdAndTemplate,
): Promise<NextResponse> => {
    if (!context.params.id || !context.params.template) {
        return NextResponse.json({success: false, data: null}, {status: 400})
    }

    const activities = await handleGetUserActivitiesByTemplateId(
        context.params.template,
        context.params.id,
    )

    if (activities.error) {
        return produceNextResponseError(activities.error, activities.dbCause)
    }

    return NextResponse.json({success: true, data: activities}, {status: 200})
}

export const resolveAggregateFromActiveIntervals = async (
    request: NextRequest,
    context: resourceByUserAndTemplate,
): Promise<NextResponse> => {
    if (!context.params.user || !context.params.template) {
        return NextResponse.json({success: false, data: {error: "Missing parameters."}}, {status: 400})
    }
    const activities = await handleAggregateFromActiveIntervals(
        context.params.template,
        context.params.user,
    )

    if (activities.error) {
        return produceNextResponseError(activities.error, activities.dbCause)
    }

    return NextResponse.json({success: true, data: activities}, {status: 200})
}

export const resolveAggregateFromActiveIntervalsGrouped = async (
    request: NextRequest,
    context: resourceByUserAndTemplate,
): Promise<NextResponse> => {
    if (!context.params.user || !context.params.template) {
        return NextResponse.json({success: false, data: {error: "Missing parameters."}}, {status: 400})
    }
    const activities = await handleAggregateFromActiveIntervalsGrouped(
        context.params.template,
        context.params.user,
    )

    if (activities.error) {
        return produceNextResponseError(activities.error, activities.dbCause)
    }

    return NextResponse.json({success: true, data: activities}, {status: 200})
}

export const resolveAggregateFromActiveIntervalsGroupedSelected = async (
    request: NextRequest,
    context: resourceByUserAndTemplate,
): Promise<NextResponse> => {

    if (!context.params.user || !context.params.template) {
        return NextResponse.json({success: false, data: {error: "Missing parameters."}}, {status: 400})
    }

    if (request.headers.get("content-type") !== "application/json") {
        return NextResponse.json(
            {success: false, data: {error: "Invalid request format, use JSON."}},
            {status: 415},
        )
    }
    const filterList = await extractJSONData<activityFilterList>(request)
    if(!filterList) {
        return NextResponse.json({success: false, data: {error: "Missing body attribute 'filterList'."}}, {status: 400})
    }

    const activities = await handleAggregateFromActiveIntervalsGroupedSelected(
        context.params.template,
        context.params.user,
        filterList.filterList
        )

    if (activities.error) {
        return produceNextResponseError(activities.error, activities.dbCause)
    }

    return NextResponse.json({success: true, data: activities}, {status: 200})
}

export const resolveGetAllActivities = async (
    request: NextRequest,
): Promise<NextResponse> => {
    const activities = await handleGetAllActivities()

    if (activities.error) {
        return produceNextResponseError(activities.error, activities.dbCause)
    }

    return NextResponse.json({success: true, data: activities}, {status: 200})
}

export const resolveDeleteActivity = async (
    request: NextRequest,
    context: resourceRequestById,
): Promise<NextResponse> => {
    if (!context.params.id) {
        return NextResponse.json({success: false, data: null}, {status: 400})
    }
    const deleteResponse = await handleDeleteActivity(context.params.id)

    if (deleteResponse.error) {
        return produceNextResponseError(deleteResponse.error, deleteResponse.dbCause)
    }
    return NextResponse.json(
        {success: true, data: deleteResponse},
        {status: 200},
    )
}

export const resolveUpdateActivityChallenge = async (
    request: NextRequest,
    context: resourceRequestById,
): Promise<NextResponse> => {
    if (request.headers.get("content-type") !== "application/json") {
        return NextResponse.json(
            {success: false, data: {error: "Invalid request format, use JSON."}},
            {status: 415},
        )
    }
    const updateIntervalRequest = await extractJSONData<ActivityUpdate>(request)

    if (!updateIntervalRequest) {
        return NextResponse.json(
            {success: false, data: {error: "JSON Parsing error."}},
            {status: 500},
        )
    }

    if (!updateIntervalRequest.goalId) {
        updateIntervalRequest.goalId = context.params.id
    }

    const updateResponse = await handleUpdateActivityChallenge(
        updateIntervalRequest,
    )

    if (updateResponse.error) {
        return produceNextResponseError(updateResponse.error, updateResponse.dbCause)
    }
    return NextResponse.json(
        {success: true, data: updateResponse},
        {status: 200},
    )
}

export const resolveGetAllIntervalsFromActivityId = async (
    request: NextRequest,
    context: resourceRequestById,
): Promise<NextResponse> => {
    if (!context.params.id) {
        return NextResponse.json({success: false, data: null}, {status: 400})
    }

    const intervals = await handleGetAllIntervalsFromActivity(context.params.id)

    if (intervals.error) {
        return produceNextResponseError(intervals.error, intervals.dbCause)
    }

    return NextResponse.json({success: true, data: intervals}, {status: 200})
}

export const resolveCreateDuplicateActivityById = async (
    request: NextRequest,
    context: resourceRequestById,
): Promise<NextResponse> => {
    if (!context.params.id) {
        return NextResponse.json({success: false, data: null}, {status: 400})
    }

    const duplicatedElement = await handleDuplicateActivityFromActivityId(
        context.params.id,
    )

    if (duplicatedElement.error) {
        return produceNextResponseError(duplicatedElement.error, duplicatedElement.dbCause)
    }

    return NextResponse.json(
        {success: true, data: duplicatedElement},
        {status: 200},
    )
}

export const resolveGetUserActivities = async (
    request: NextRequest,
    context: resourceRequestById,
): Promise<NextResponse> => {
    const activities = await handleGetAllActivitiesFromUserId(context.params.id)

    if (activities.error) {
        return produceNextResponseError(activities.error, activities.dbCause)
    }

    return NextResponse.json({success: true, data: activities}, {status: 200})
}

export const resolveGetActivitiesByActivityId = async (
    request: NextRequest,
    context: resourceRequestById,
): Promise<NextResponse> => {
    const activity = await handleGetActivityFromActivityId(context.params.id)

    if (activity.error) {
        return produceNextResponseError(activity.error, activity.dbCause)
    }
    return NextResponse.json({success: true, data: activity}, {status: 200})
}

export const resolveGetActivitiesByActivityIdWithReport = async (
    request: NextRequest,
    context: resourceRequestById,
): Promise<NextResponse> => {
    const activity = await handleGetActivityFromActivityIdWithReports(context.params.id)

    if (activity.error) {
        return produceNextResponseError(activity.error, activity.dbCause)
    }
    return NextResponse.json({success: true, data: activity}, {status: 200})
}


export const resolveGetOutdatedActivities = async (request: NextRequest): Promise<NextResponse> => {
    const activities = await handleGetOutdatedActivities()

    if (activities.error) {
        return produceNextResponseError(activities.error, activities.dbCause)
    }
    return NextResponse.json({success: true, data: activities}, {status: 200})
}
