export type Interval = {
    id?: string
    duration: number
    intensity: number
    intervalNr?: number
    perceivedIntensityGoal?: number | null
    perceivedIntensityMin?: number | null
    perceivedIntensityAvg?: number | null
    perceivedIntensityMax?: number | null
    wattGoal?: number | null
    wattMin?: number | null
    wattAvg?: number | null
    wattMax?: number | null
    speedGoal?: number | null
    speedMin?: number | null
    speedAvg?: number | null
    speedMax?: number | null
    heartrateGoal?: number | null
    heartrateMin?: number | null
    heartrateAvg?: number | null
    heartrateMax?: number | null
    templateId?: string | null
}
export type IntervalInsert = Interval & {
    connectedActivity: string
}

export type IntervalUpdate = Partial<Interval> & {
    id: string
}