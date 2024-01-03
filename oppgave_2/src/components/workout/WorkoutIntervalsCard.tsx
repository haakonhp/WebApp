"use client"

import React, { useEffect, useReducer, useState } from "react"
import { toast } from "react-toastify"
import type { ActivityResponse } from "@/types/activity"

import { type Interval } from "@/types/interval"
import Card from "../shared/Card"
import Loading from "../shared/Loading"

const WorkoutIntervalsCard = ({
  workoutData,
  isEditable = false,
}: {
  workoutData: ActivityResponse | undefined | null
  isEditable?: boolean
}) => {
  if (workoutData === undefined) {
    return <Loading />
  }
  if (workoutData === null) {
    return <p>Fant ingen økt data</p>
  }
  return (
    <Card title="Intervals" icon={IntervalIcon}>
      <WorkoutIntervalInfo workoutData={workoutData} isEditable={isEditable} />
    </Card>
  )
}

const IntervalIcon = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 16 16"
        className="mr-6"
      >
        <path
          fill="currentColor"
          d="M9 3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v8.5a2.5 2.5 0 0 1-2.5 2.5H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h3V7a1 1 0 0 1 1-1h3V3Zm4 0h-3v3a1 1 0 0 1-1 1H6v2a1 1 0 0 1-1 1H2v3h9.5a1.5 1.5 0 0 0 1.5-1.5V3Z"
        />
      </svg>
    </>
  )
}

const WorkoutIntervalInfo = ({
  workoutData,
  isEditable,
}: {
  workoutData: ActivityResponse
  isEditable: boolean
}) => {
  const [intervalData, setIntervalData] = useState<
    Interval[] | undefined | null
  >(undefined)

  const [step, setStep] = useState<number>(0)

  useEffect(() => {
    const fetchWorkoutIntervals = async () => {
      try {
        const response = await fetch(
          `/api/activities/${workoutData.goalId}/intervals`,
          {
            method: "get",
          },
        )

        const result = (await response.json()) as {
          data: { data: Interval[] | null }
        }
        setIntervalData(result.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    void fetchWorkoutIntervals()
  }, [workoutData.goalId])

  if (intervalData === undefined) {
    return <Loading />
  }
  if (intervalData === null) {
    return <p>Fant ingen intervaller</p>
  } else
    return (
      <>
        <p>
          {step + 1} / {intervalData.length}
        </p>
        <IntervalBox
          key={step}
          isEditable={isEditable}
          index={step + 1}
          workoutData={workoutData}
          item={intervalData[step]}
        />
        <div className="mt-6 flex flex-row">
          {step > 0 && (
            <button
              type="button"
              onClick={() => {
                setStep((prev) => prev - 1)
              }}
              className="mb-2 me-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            >
              Back
            </button>
          )}

          {step + 1 < intervalData.length && (
            <button
              type="button"
              onClick={() => {
                setStep((prev) => prev + 1)
              }}
              className="mb-2 me-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            >
              Neste
            </button>
          )}
        </div>
      </>
    )
}

const IntervalBox = ({
  index,
  item,
  workoutData,
  isEditable,
}: {
  index: number
  item: Interval
  workoutData: ActivityResponse
  isEditable: boolean
}) => {
  const hasWatt = workoutData.wattChecked
  const hasSpeed = workoutData.speedChecked
  const hasHeartrate = workoutData.heartrateChecked
  const hasPercievedIntensity = workoutData.intensityChecked

  const intervalItems: Interval = {
    perceivedIntensityMin: item.perceivedIntensityMin,
    perceivedIntensityAvg: item.perceivedIntensityAvg,
    perceivedIntensityMax: item.perceivedIntensityMax,
    wattMin: item.wattMin,
    wattAvg: item.wattAvg,
    wattMax: item.wattMax,
    speedMin: item.speedMin,
    speedAvg: item.speedAvg,
    speedMax: item.speedMax,
    heartrateMin: item.heartrateMin,
    heartrateAvg: item.heartrateAvg,
    heartrateMax: item.heartrateMax,
    duration: item.duration,
    intensity: item.intensity,
  }

  // https://codingislove.com/how-to-store-and-update-multiple-field-values-in-react-using-usereducer/
  const [fieldValues, setFieldValues] = useReducer(
    (state: Interval, newState: Partial<Interval>) => ({
      ...state,
      ...newState,
    }),
    intervalItems,
  )

  const updateInterval = async () => {
    try {
      const response = await fetch(`/api/intervals/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fieldValues),
      })

      if (!response.ok) {
        toast.error("Kunne ikke oppdatere intervall")
      } else {
        toast.success("Oppdatert intervall")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <h1 className="flex items-center text-2xl font-extrabold dark:text-white">
        Intervall
        <span className="me-2 ms-2 rounded bg-blue-100 px-2.5 py-0.5 text-xl font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800">
          {index}
        </span>
      </h1>

      <p>Varighet: {item.duration} min</p>
      <p>Sone: {item.intensity}</p>
      <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />

      <div className="mb-6">
        {hasPercievedIntensity && (
          <DataTable
            title="Opplevd intesitet"
            minProperty={fieldValues.perceivedIntensityMin}
            maxProperty={fieldValues.perceivedIntensityMax}
            avgProperty={fieldValues.perceivedIntensityAvg}
            isEditable={isEditable}
            properties={[
              "perceivedIntensityMin",
              "perceivedIntensityMax",
              "perceivedIntensityAvg",
            ]}
            setFieldValues={setFieldValues}
          />
        )}
        {hasWatt && (
          <DataTable
            title="Watt"
            minProperty={fieldValues.wattMin}
            maxProperty={fieldValues.wattMax}
            avgProperty={fieldValues.wattAvg}
            isEditable={isEditable}
            properties={["wattMin", "wattMax", "wattAvg"]}
            setFieldValues={setFieldValues}
          />
        )}
        {hasHeartrate && (
          <DataTable
            title="Puls"
            minProperty={fieldValues.heartrateMin}
            maxProperty={fieldValues.heartrateMax}
            avgProperty={fieldValues.heartrateAvg}
            isEditable={isEditable}
            properties={["heartrateMin", "heartrateMax", "heartrateAvg"]}
            setFieldValues={setFieldValues}
          />
        )}
        {hasSpeed && (
          <DataTable
            title="Fart"
            minProperty={fieldValues.speedMin}
            maxProperty={fieldValues.speedMax}
            avgProperty={fieldValues.speedAvg}
            isEditable={isEditable}
            properties={["speedMin", "speedMax", "speedAvg"]}
            setFieldValues={setFieldValues}
          />
        )}
      </div>
      {isEditable ? (
        <button
          type="button"
          onClick={() => {
            void updateInterval()
          }}
          className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Lagre
        </button>
      ) : null}
    </>
  )
}

const DataTable = ({
  title,
  minProperty,
  maxProperty,
  avgProperty,
  isEditable,
  properties,
  setFieldValues,
}: {
  title: string
  minProperty: number | null | undefined
  maxProperty: number | null | undefined
  avgProperty: number | null | undefined
  isEditable: boolean
  properties: string[]
  setFieldValues: React.Dispatch<Partial<Interval>>
}) => {
  return (
    <>
      <span className="mb-2 rounded bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
        {title}
      </span>

      <table className="mb-2 mt-2 w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Min
            </th>
            <th scope="col" className="px-6 py-3">
              Maks
            </th>
            <th scope="col" className="px-6 py-3">
              Snitt
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
              {isEditable ? (
                <input
                  type="number"
                  onChange={(e) => {
                    setFieldValues({
                      [properties[0]]: parseInt(e.currentTarget.value),
                    })
                  }}
                  value={minProperty ?? ""}
                  id="number"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
              ) : (
                <p>{minProperty ?? "Mangler"}</p>
              )}
            </td>

            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
              {isEditable ? (
                <input
                  type="number"
                  onChange={(e) => {
                    setFieldValues({
                      [properties[1]]: parseInt(e.currentTarget.value),
                    })
                  }}
                  value={maxProperty ?? ""}
                  id="number"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
              ) : (
                <p>{maxProperty ?? "Mangler"}</p>
              )}
            </td>

            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
              {isEditable ? (
                <input
                  type="number"
                  onChange={(e) => {
                    setFieldValues({
                      [properties[2]]: parseInt(e.currentTarget.value),
                    })
                  }}
                  value={avgProperty ?? ""}
                  id="number"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
              ) : (
                <p>{avgProperty ?? "Mangler"}</p>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}
export default WorkoutIntervalsCard
