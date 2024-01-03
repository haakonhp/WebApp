export type analysisAggregate = {
  _avg: {
    heartrateMin: number | null
    heartrateAvg: number | null
    heartrateMax: number | null
    speedMin: number | null
    speedAvg: number | null
    speedMax: number | null
    perceivedIntensityMin: number | null
    perceivedIntensityAvg: number | null
    perceivedIntensityMax: number | null
    wattMin: number | null
    wattAvg: number | null
    wattMax: number | null
  }
}
export type analysisAggregateGrouped = analysisAggregate & {
  intervalNr: number
}
