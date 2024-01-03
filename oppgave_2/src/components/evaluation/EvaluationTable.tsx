"use client"

import React, { useEffect, useState } from "react"
import type { ActivityResponse, userActivityByTemplate } from "@/types/activity"

import { analysisAggregateGrouped } from "@/types/analysis"
import Analysis from "../analysis/Analysis"
import AlertCard from "../shared/AlertCard"
import Loading from "../shared/Loading"

const EvaluationTable = ({
  selectedTemplate,
  userId,
}: {
  selectedTemplate: string
  userId: string
}) => {
  const [chosenWorkouts, setChosenWorkouts] = useState<string[]>([])
  const [toggleAnalysis, setToggleAnalysis] = useState(false)

  const [analysisWorkoutsData, setAnalysisWorkoutsData] = useState<
    ActivityResponse[] | null
  >(null)

  const [AverageAnalysisData, setAverageAnalysisData] = useState<
    analysisAggregateGrouped[] | null
  >(null)

  const handleCheckBoxSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    workoutId: string,
  ) => {
    if (event.target.checked) {
      setChosenWorkouts((prevIds) => [...prevIds, workoutId])
    } else {
      setChosenWorkouts((prevIds) => prevIds.filter((id) => id !== workoutId))
    }
  }

  const [workouts, setWorkouts] = useState<
    userActivityByTemplate[] | undefined | null
  >(undefined)
  useEffect(() => {
    const fetchActivitiesByTemplateId = async () => {
      try {
        const response = await fetch(
          `/api/activities/${userId}/${selectedTemplate}`,
          {
            method: "GET",
          },
        )
        const result = (await response.json()) as {
          data: { data: userActivityByTemplate[] }
        }
        setWorkouts(result.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    console.log(selectedTemplate)
    void fetchActivitiesByTemplateId()
  }, [selectedTemplate, userId])

  const fetchAnalysis = async () => {
    const payload = {
      filterList: chosenWorkouts,
    }
    try {
      const response = await fetch(
        `/api/analysis/${userId}/${selectedTemplate}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      )

      const result = (await response.json()) as {
        data: { data: ActivityResponse[] }
      }
      setAnalysisWorkoutsData(result.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchAvgAnalysis = async () => {
    const payload = {
      filterList: chosenWorkouts,
    }
    try {
      const response = await fetch(
        `/api/analysis/${userId}/${selectedTemplate}/aggregate/grouped`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      )

      const result = (await response.json()) as {
        data: { data: analysisAggregateGrouped[] }
      }
      setAverageAnalysisData(result.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const Analyze = () => {
    void fetchAnalysis()
    void fetchAvgAnalysis()
    setToggleAnalysis(true)
  }

  if (workouts === undefined) {
    return <Loading />
  }
  if (workouts === null) {
    return (
      <AlertCard title="Fant ingen økter" description="Registrer en ny økt" />
    )
  } else {
    return (
      <>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4"></th>
                <th scope="col" className="px-6 py-3">
                  Økt
                </th>
                <th scope="col" className="px-6 py-3">
                  Navn
                </th>
                <th scope="col" className="px-6 py-3">
                  Rapporterte intervaller
                </th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout, index) => (
                <>
                  <tr className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id={`checkbox-table-search-${workout.goalId}`}
                          onChange={(e) => {
                            handleCheckBoxSelect(e, workout.goalId)
                          }}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                        />
                        <label
                          htmlFor="checkbox-table-search-1"
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      {index + 1}
                    </th>
                    <td className="px-6 py-4">{workout.name}</td>
                    <td className="px-6 py-4">{workout._count.intervals}</td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
        <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />
        <div className="flex flex-col">
          <p className="text-gray-500 dark:text-gray-400">
            Valgte økter for sammenligning:
          </p>
          <div>
            {chosenWorkouts.map((item) => (
              <span
                key={item}
                className="me-2 rounded bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              >
                {item}
              </span>
            ))}
          </div>

          {chosenWorkouts.length != 0 && (
            <button
              type="button"
              onClick={() => {
                Analyze()
              }}
              className="mb-2 me-2 mt-6 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            >
              Analyser
            </button>
          )}
        </div>
        {toggleAnalysis && analysisWorkoutsData && AverageAnalysisData && (
          <Analysis
            analysisWorkoutsData={analysisWorkoutsData}
            AverageAnalysisData={AverageAnalysisData}
          />
        )}
      </>
    )
  }
}
export default EvaluationTable
