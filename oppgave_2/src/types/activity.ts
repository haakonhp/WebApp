import type {Goal} from "@/types/baseTypes";
import type {StatusVariants} from "@/types/stringVariants";
import {type checkBoxes} from "@/types/template";
import {type Question} from "@/types/question";
import {type Interval} from "@/types/interval";
import {type Tournament} from "@/types/tournament";

export type ActivityInsert = {
    goalId?: string
    userId: string
    date: Date
    slug: string
    name: string,
    template?: string,
    tagsStringable: string,
    tournamentId?: string | null,
    personalGoalId?: string | null,
    sport: string
    tags?: string[]
    questions?: Question[]
    intervals?: Interval[]
} & checkBoxes

export type ActivityUpdate = {
    goalId: string,
    tournamentId?: string | null,
    personalGoalId?: string | null
}


export type ActivityResponse = {
    goalId: string
    userId: string
    date: Date | null
    slug: string
    sport: string | null
    name: string | null
    tagsStringable: string
    tags?: string[]
    questions?: Question[]
    intervals?: Interval[]
    activityReport?: {
        id: string,
        status: StatusVariants
        connectedActivity: string,
        createdAt: Date
        updatedAt: Date
        comment?: string
    }[],
    tournament?: Tournament | null,
    personalGoal?: Goal | null,
} & checkBoxes

export type userActivityByTemplate = {
    goalId: string,
    name: string | null,
    _count: {
        intervals: number
    }
}

export type activityFilterList = {
    filterList: string[]
}