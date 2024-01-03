import {Prisma, PrismaClient} from "@prisma/client";
import {produceDatabaseError} from "@/features/HelperFeatures/serviceFunctions/prismaKnownErrorSwitch";
import {errorCodes} from "@/types/errorCodes";
import type {ActivityInsert, ActivityResponse, ActivityUpdate, userActivityByTemplate} from "@/types/activity";
import type {analysisAggregate, analysisAggregateGrouped} from "@/types/analysis";
import type {Interval, IntervalInsert, IntervalUpdate} from "@/types/interval";
import type {databaseResult} from "@/types/DatatransferTypes";

const prismaLocal = new PrismaClient()

// Prisma conditional join is a modified version of the answer given by ryandis17
// https://github.com/prisma/prisma/discussions/9462
export const addActivity = async (singleActivity: ActivityInsert, prisma: PrismaClient = prismaLocal): Promise<databaseResult<ActivityResponse>> => {
    const {
        userId, tags, intervals, questions, sport,
        personalGoalId, tournamentId, template, ...activityData
    } = singleActivity
    try {
        const activity = await prisma.userActivity.create({
            data: {
                ...activityData,
                User: {
                    connect: {
                        userId: userId
                    },
                },
                sportType: {
                    connect: {
                        sport: sport
                    }
                },
                ...(template &&
                    {
                        createdFrom: {
                            connect: {
                                id: template
                            }
                        }
                    }),
                ...(tournamentId &&
                    {
                        tournament: {
                            connect: {
                                id: tournamentId
                            }
                        }
                    }
                ),
                ...(personalGoalId &&
                    {
                        personalGoal: {
                            connect: {
                                id: personalGoalId
                            }
                        }
                    }
                ),
            }
        })
        return {success: true, data: activity}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<ActivityResponse>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}


export const deleteActivity = async (id: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<ActivityResponse>> => {
    try {
        const activity = await prisma.userActivity.delete({
            where: {
                goalId: id
            }
        })
        return {success: true, data: activity}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<ActivityResponse>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const updateActivityChallenge = async (update: ActivityUpdate, prisma: PrismaClient = prismaLocal): Promise<databaseResult<ActivityResponse>> => {
    try {
        const activity = await prisma.userActivity.update({
            data: {
                tournamentId: update.tournamentId,
                personalGoalId: update.personalGoalId
            },
            where: {
                goalId: update.goalId
            }
        })
        return {success: true, data: activity}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<ActivityResponse>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}


export const getAllActiveActivitiesFromTemplate = async (templateId: string, acceptableStatus: string[], prisma: PrismaClient = prismaLocal): Promise<databaseResult<ActivityResponse[]>> => {
    try {
        const activities = await prisma.userActivity.findMany({
            where: {
                template: templateId,
                activityReport: {
                    some: {
                        status: {in: acceptableStatus}
                    }
                }
            }
        })
        return {success: true, data: activities}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<ActivityResponse[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getActiveIntervalsFromTemplateByUser = async (templateId: string, userId: string, acceptableStatus: string[], prisma: PrismaClient = prismaLocal): Promise<databaseResult<ActivityResponse[]>> => {
    try {
        const activities = await prisma.userActivity.findMany({
            where: {
                userId: userId,
                template: templateId,
                activityReport: {
                    some: {
                        status: {in: acceptableStatus}
                    }
                }
            },
            include: {
                intervals: true,
            }
        })
        return {success: true, data: activities}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<ActivityResponse[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}


export const getActiveIntervalsFromTemplateByUserSelectedIds = async (templateId: string, userId: string, acceptableStatus: string[], selectedIds: string[], prisma: PrismaClient = prismaLocal): Promise<databaseResult<ActivityResponse[]>> => {
    try {
        const activities = await prisma.userActivity.findMany({
            where: {
                goalId: {in: selectedIds},
                userId: userId,
                template: templateId,
                activityReport: {
                    some: {
                        status: {in: acceptableStatus}
                    }
                }
            },
            include: {
                intervals: true,
            }
        })
        return {success: true, data: activities}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<ActivityResponse[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getAggregateFromActiveIntervals = async (templateId: string, userId: string, acceptableStatus: string[], prisma: PrismaClient = prismaLocal): Promise<databaseResult<analysisAggregate>> => {
    try {
        const activities = await prisma.userActivityInterval.aggregate({
                where: {
                    UserActivity: {
                        userId: userId,
                        template: templateId,
                        activityReport: {
                            some: {
                                status: {in: acceptableStatus}
                            }
                        }
                    },
                },
                _avg: {
                    heartrateMin: true,
                    speedMin: true,
                    perceivedIntensityMin: true,
                    heartrateAvg: true,
                    speedAvg: true,
                    perceivedIntensityAvg: true,
                    heartrateMax: true,
                    speedMax: true,
                    perceivedIntensityMax: true,
                    wattMin: true,
                    wattAvg: true,
                    wattMax: true,
                },
            }
        )
        return {success: true, data: activities}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<analysisAggregate>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getAggregateFromActiveIntervalsGrouped = async (templateId: string, userId: string, acceptableStatus: string[], prisma: PrismaClient = prismaLocal): Promise<databaseResult<analysisAggregateGrouped[]>> => {
    try {
        const activities = await prisma.userActivityInterval.groupBy({
                by: ['intervalNr'],
                where: {
                    UserActivity: {
                        userId: userId,
                        template: templateId,
                        activityReport: {
                            some: {
                                status: {in: acceptableStatus}
                            }
                        }
                    },
                },
                _avg: {
                    heartrateMin: true,
                    speedMin: true,
                    perceivedIntensityMin: true,

                    heartrateAvg: true,
                    speedAvg: true,
                    perceivedIntensityAvg: true,

                    heartrateMax: true,
                    speedMax: true,
                    perceivedIntensityMax: true,

                    wattMin: true,
                    wattAvg: true,
                    wattMax: true,
                }
            }
        )
        return {success: true, data: activities}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<analysisAggregateGrouped[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getAggregateFromActiveIntervalsGroupedSelected = async (templateId: string, userId: string, acceptableStatus: string[], selectedIds: string[], prisma: PrismaClient = prismaLocal): Promise<databaseResult<analysisAggregateGrouped[]>> => {
    try {
        const activities = await prisma.userActivityInterval.groupBy({
                by: ['intervalNr'],
                where: {
                    UserActivity: {
                        goalId: {in: selectedIds},
                        userId: userId,
                        template: templateId,
                        activityReport: {
                            some: {
                                status: {in: acceptableStatus}
                            }
                        }
                    },
                },
                _avg: {
                    heartrateMin: true,
                    speedMin: true,
                    perceivedIntensityMin: true,

                    heartrateAvg: true,
                    speedAvg: true,
                    perceivedIntensityAvg: true,

                    heartrateMax: true,
                    speedMax: true,
                    perceivedIntensityMax: true,

                    wattMin: true,
                    wattAvg: true,
                    wattMax: true,
                }
            }
        )
        return {success: true, data: activities}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<analysisAggregateGrouped[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getAllActivities = async (prisma: PrismaClient = prismaLocal): Promise<databaseResult<ActivityResponse[]>> => {
    try {
        const activities = await prisma.userActivity.findMany({})

        if (!activities.length) {
            return {success: true, data: null, error: errorCodes.NO_CONTENT}
        }

        return {success: true, data: activities}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<ActivityResponse[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getActivitiesByUserId = async (id: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<ActivityResponse[]>> => {
    try {
        const activities = await prisma.userActivity.findMany({
            where: {
                userId: id
            },
            include: {
                activityReport: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            }
        })
        if (!activities.length) {
            return {success: true, data: null, error: errorCodes.NO_CONTENT}
        }

        return {success: true, data: activities as ActivityResponse[]}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<ActivityResponse[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getUserActivitiesByTemplateIdWithCount = async (templateId: string, acceptableStatus: string[], userId: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<userActivityByTemplate[]>> => {
    try {
        const activities = await prisma.userActivity.findMany({
            where: {
                userId: userId,
                template: templateId
            },
            select: {
                goalId: true,
                name: true,
                _count: {
                    select: {
                        intervals: {
                            where: {
                                UserActivity: {
                                    activityReport: {
                                        some: {
                                            status: {in: acceptableStatus}
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        if (!activities.length) {
            return {success: true, data: null, error: errorCodes.NO_CONTENT}
        }

        return {success: true, data: activities}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<userActivityByTemplate[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}


export const addInterval = async (singleInterval: IntervalInsert, count?: number, prisma: PrismaClient = prismaLocal): Promise<databaseResult<Interval>> => {
    const {connectedActivity, templateId, ...intervalData} = singleInterval
    try {
        if (!count) {
            count = await prisma.userActivityInterval.count({
                where: {
                    connectedActivity: singleInterval.connectedActivity
                }
            })
        }
        const interval = await prisma.userActivityInterval.create({
            data: {
                intervalNr: count,
                ...intervalData,
                UserActivity: {
                    connect: {
                        goalId: connectedActivity
                    }
                }
            }
        })
        return {success: true, data: interval}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<Interval>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const updateInterval = async (singleInterval: IntervalUpdate, prisma: PrismaClient = prismaLocal): Promise<databaseResult<Interval>> => {
    const {templateId, id, ...intervalData} = singleInterval
    try {

        const interval = await prisma.userActivityInterval.update({
            where: {
                id: id
            },
            data: {
                ...intervalData,

            }
        })
        return {success: true, data: interval}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<Interval>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const addTemplateInterval = async (singleInterval: IntervalInsert, count?: number, prisma: PrismaClient = prismaLocal): Promise<databaseResult<Interval>> => {
    const {connectedActivity, templateId, ...intervalData} = singleInterval
    try {
        if (!count) {
            count = await prisma.userActivityInterval.count({
                where: {
                    connectedActivity: singleInterval.connectedActivity
                }
            })
        }
        const interval = await prisma.userActivityInterval.create({
            data: {
                intervalNr: count,
                ...intervalData,
                connectedTemplate: {
                    connect: {
                        id: connectedActivity
                    }
                }
            }
        })
        return {success: true, data: interval}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<Interval>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}


export const getActivityWithConnectedData = async (id: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<ActivityResponse>> => {
    try {
        const activity = await prisma.userActivity.findUnique({
            where: {
                goalId: id
            },
            include: {
                intervals: true,
                questions: true
            }
        })

        if (!activity) {
            return {success: true, data: null, error: errorCodes.NO_CONTENT}
        }
        return {success: true, data: activity as ActivityResponse}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<ActivityResponse>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getIntervalsByActivityId = async (acttivityId: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<Interval[]>> => {
    try {
        const interval = await prisma.userActivityInterval.findMany({
            where: {
                connectedActivity: acttivityId
            },
            orderBy: {
                intervalNr: "asc"
            }
        })

        if (!interval.length) {
            return {success: false, data: null, error: errorCodes.NO_CONTENT}
        }

        return {success: true, data: interval}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<Interval[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}


export const getActivity = async (id: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<ActivityResponse>> => {
    try {
        const activity = await prisma.userActivity.findUnique({
            where: {
                goalId: id
            },
            include: {
                tournament: true,
                personalGoal: true,
            }
        })
        return {success: true, data: activity}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<ActivityResponse>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}

export const getOutdatedActivities = async (prisma: PrismaClient = prismaLocal): Promise<databaseResult<ActivityResponse[]>> => {
    try {
        const outdatedActivities = await prisma.userActivity.findMany({
            where: {
                date: {
                    lte: new Date(Date.now())
                },
                activityReport: {
                    none: {}
                }
            },

        })
        return {success: true, data: outdatedActivities}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<ActivityResponse[]>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}



export const getActivityWithReports = async (id: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<ActivityResponse>> => {
    try {
        const activity = await prisma.userActivity.findUnique({
            where: {
                goalId: id
            },
            include: {
                tournament: true,
                personalGoal: true,
                activityReport: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            }
        })
        return {success: true, data: activity as ActivityResponse}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<ActivityResponse>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}



export const getIntervalCount = async (activityId: string, prisma: PrismaClient = prismaLocal): Promise<databaseResult<number>> => {
    try {
        const count = await prisma.userActivityInterval.count({
            where: {
                connectedActivity: activityId
            }
        })
        return {success: true, data: count}
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return produceDatabaseError<number>(e)
        }
        return {success: false, data: null, error: errorCodes.GENERIC_ERROR}
    }
}



