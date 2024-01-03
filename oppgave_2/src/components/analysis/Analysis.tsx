"use client"

import React, { useEffect, useState } from "react"
import type { ActivityResponse } from "@/types/activity"
import type { analysisAggregateGrouped } from "@/types/analysis"

import ActivityCheckbox from "../newworkout/v2/ActivityCheckbox"
import Card from "../shared/Card"
import { EvaluationIcon } from "../shared/SharedIcons"

const Analysis = ({
  analysisWorkoutsData,
  AverageAnalysisData,
}: {
  analysisWorkoutsData: ActivityResponse[]
  AverageAnalysisData: analysisAggregateGrouped[]
}) => {
  return (
    <>
      <Card title="Analyse" icon={EvaluationIcon}>
        <AnalysisFilter
          analysisWorkoutsData={analysisWorkoutsData}
          AverageAnalysisData={AverageAnalysisData}
        />
      </Card>
    </>
  )
}

const AnalysisFilter = ({
  analysisWorkoutsData,
  AverageAnalysisData,
}: {
  analysisWorkoutsData: ActivityResponse[]
  AverageAnalysisData: analysisAggregateGrouped[]
}) => {
  const [hasIntensity, setHasIntensity] = useState<boolean | undefined>(false)
  const [hasWatt, setHasWatt] = useState<boolean | undefined>(false)
  const [hasHeartrate, setHasHeartrate] = useState<boolean | undefined>(false)
  const [hasSpeed, setHasSpeed] = useState<boolean | undefined>(false)

  return (
    <>
      <div className="mb-6 flex flex-col gap-2">
        <p>Filtrer på:</p>

        <ActivityCheckbox
          intensityChecked={hasIntensity}
          setIntensityChecked={setHasIntensity}
          wattChecked={hasWatt}
          setWattChecked={setHasWatt}
          speedChecked={hasSpeed}
          setSpeedChecked={setHasSpeed}
          heartrateChecked={hasHeartrate}
          setHeartrateChecked={setHasHeartrate}
        />
      </div>

      {hasIntensity || hasWatt || hasSpeed || hasHeartrate ? (
        <AnalysisTable
          analysisWorkoutsData={analysisWorkoutsData}
          AverageAnalysisData={AverageAnalysisData}
          hasIntensity={!!hasIntensity}
          hasWatt={!!hasWatt}
          hasSpeed={!!hasSpeed}
          hasHeartrate={!!hasHeartrate}
        />
      ) : (
        "Velg minst en filter for å vise tabellen."
      )}
    </>
  )
}

const AnalysisTable = ({
  hasIntensity,
  hasWatt,
  analysisWorkoutsData,
  hasSpeed,
  hasHeartrate,
  AverageAnalysisData,
}: {
  hasIntensity: boolean
  hasWatt: boolean
  hasSpeed: boolean
  hasHeartrate: boolean
  analysisWorkoutsData: ActivityResponse[]
  AverageAnalysisData: analysisAggregateGrouped[]
}) => {
  let maxIntervals = 0
  let activityWithMaxIntervals = null

  analysisWorkoutsData.forEach((activity) => {
    const numIntervals = activity.intervals?.length
    if (numIntervals !== undefined && numIntervals > maxIntervals) {
      maxIntervals = numIntervals
      activityWithMaxIntervals = activity
    }
  })

  return (
    <>
      <div className="relative overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">
                Økt
              </th>
              {/*https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from */}
              {Array.from({ length: maxIntervals }, (_, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-3 py-2 sm:px-6 sm:py-3"
                >
                  Intervall {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {analysisWorkoutsData.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <td className="px-6 py-4">{item.name}</td>
                {item.intervals!.map((interval, index) => (
                  <td key={index} className="px-6 py-4">
                    <TableColumn
                      item={item}
                      index={index}
                      hasIntensity={hasIntensity}
                      hasWatt={hasWatt}
                      hasSpeed={hasSpeed}
                      hasHeartrate={hasHeartrate}
                    />
                  </td>
                ))}
              </tr>
            ))}
            <tr className="px-6 py-4">
              <td className="px-6 py-4">Snitt</td>
              {AverageAnalysisData.map((item, index) => (
                <td key={index} className="px-6 py-4">
                  <AverageCalculation
                    hasIntensity={hasIntensity}
                    hasWatt={hasWatt}
                    hasSpeed={hasSpeed}
                    hasHeartrate={hasHeartrate}
                    heartrateMin={item._avg.heartrateMin}
                    heartrateAvg={item._avg.heartrateAvg}
                    heartrateMax={item._avg.heartrateMax}
                    speedMin={item._avg.speedMin}
                    speedAvg={item._avg.speedAvg}
                    speedMax={item._avg.speedMax}
                    percievedIntensityMin={item._avg.perceivedIntensityMin}
                    percievedIntensityAvg={item._avg.perceivedIntensityAvg}
                    percievedIntensityMax={item._avg.perceivedIntensityMax}
                    wattMin={item._avg.wattMin}
                    wattAvg={item._avg.wattAvg}
                    wattMax={item._avg.wattMax}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

const TableColumn = ({
  index,
  item,
  hasIntensity,
  hasWatt,
  hasSpeed,
  hasHeartrate,
}: {
  index: number
  item: ActivityResponse
  hasIntensity: boolean
  hasWatt: boolean
  hasSpeed: boolean
  hasHeartrate: boolean
}) => {
  // PercievedIntensityMin
  const perceivedIntensityMin = item.intervals[index].perceivedIntensityMin
  const perceivedIntensityMax = item.intervals[index].perceivedIntensityMax
  const perceivedIntensityAvg = item.intervals[index].perceivedIntensityAvg
  // Watt
  const wattMin = item.intervals[index].wattMin
  const wattMax = item.intervals[index].wattMax
  const wattAvg = item.intervals[index].wattAvg
  console.log(wattAvg)

  // Speed
  const speedMin = item.intervals[index].speedMin
  const speedMax = item.intervals[index].speedMax
  const speedAvg = item.intervals[index].speedAvg

  // HeartRate
  const heartrateMin = item.intervals[index].heartrateMin
  const heartrateMax = item.intervals[index].heartrateMax
  const heartrateAvg = item.intervals[index].heartrateAvg

  return (
    <>
      {hasIntensity && (
        <DisplayItemInColumn
          title={"Opplevd intensitet"}
          min={perceivedIntensityMin}
          max={perceivedIntensityMax}
          avg={perceivedIntensityAvg}
        />
      )}

      {hasWatt && (
        <DisplayItemInColumn
          title={"Watt"}
          min={wattMin}
          max={wattMax}
          avg={wattAvg}
        />
      )}

      {hasSpeed && (
        <DisplayItemInColumn
          title={"Fart"}
          min={speedMin}
          max={speedMax}
          avg={speedAvg}
        />
      )}
      {hasHeartrate && (
        <DisplayItemInColumn
          title={"Puls"}
          min={heartrateMin}
          max={heartrateMax}
          avg={heartrateAvg}
        />
      )}
    </>
  )
}

const DisplayItemInColumn = ({
  title,
  min,
  max,
  avg,
}: {
  title: string
  min: number | null | undefined
  max: number | null | undefined
  avg: number | null | undefined
}) => {
  if (min === undefined || min === null) {
    return null
  } else {
    return (
      <>
        <div className="max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <p className="font-bold">{title}</p>
          <p>
            Min: {min} | Max: {max} | Avg: {avg}
          </p>
        </div>
      </>
    )
  }
}

const AverageCalculation = ({
  hasIntensity,
  hasWatt,
  hasSpeed,
  hasHeartrate,
  heartrateMin,
  heartrateAvg,
  heartrateMax,
  speedMin,
  speedAvg,
  speedMax,
  percievedIntensityMin,
  percievedIntensityAvg,
  percievedIntensityMax,
  wattMin,
  wattAvg,
  wattMax,
}: {
  hasIntensity: boolean
  hasWatt: boolean
  hasSpeed: boolean
  hasHeartrate: boolean
  heartrateMin: number | null
  heartrateAvg: number | null
  heartrateMax: number | null
  speedMin: number | null
  speedAvg: number | null
  speedMax: number | null
  percievedIntensityMin: number | null
  percievedIntensityAvg: number | null
  percievedIntensityMax: number | null
  wattMin: number | null
  wattAvg: number | null
  wattMax: number | null
}) => {
  return (
    <>
      {percievedIntensityMin != null && hasIntensity && (
        <DisplayItemInColumn
          min={percievedIntensityMin}
          max={percievedIntensityMax}
          avg={percievedIntensityAvg}
          title={"Snitt Opplevd itensitet"}
        />
      )}
      {heartrateMin != null && hasHeartrate && (
        <DisplayItemInColumn
          min={heartrateMin}
          max={heartrateMax}
          avg={heartrateAvg}
          title={"Snitt Puls"}
        />
      )}
      {wattMin != null && hasWatt && (
        <DisplayItemInColumn
          min={wattMin}
          max={wattMax}
          avg={wattAvg}
          title={"Snitt Watt"}
        />
      )}
      {speedMin != null && hasSpeed && (
        <DisplayItemInColumn
          min={speedMin}
          max={speedMax}
          avg={speedAvg}
          title={"Snitt Fart"}
        />
      )}
    </>
  )
}

export default Analysis
