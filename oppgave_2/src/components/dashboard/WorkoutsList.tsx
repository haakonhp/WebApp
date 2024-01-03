import React, { useEffect, useState } from "react"
import type { userActivity } from "@prisma/client"
import { format } from "date-fns"
import nb from "date-fns/locale/nb"
import { useRouter } from "next/navigation"

import { formatUserId } from "@/features/ReusableFunction/formatUserId"
import Loading from "../shared/Loading"
import { ReportIcon, ViewIcon } from "../shared/SharedIcons"

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState<userActivity[] | null | undefined>(
    undefined,
  )
  const router = useRouter()

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch(`/api/activities/`, {
          method: "get",
        })
        const result = (await response.json()) as {
          data: { data: userActivity[] }
        }
        setWorkouts(result.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    void fetchWorkouts()
  }, [])

  if (workouts === undefined) {
    return <Loading />
  }
  if (workouts === null) {
    return <p>Fant ingen økter</p>
  }

  return (
    <>
      <div className="relative mb-6 max-h-96 overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Utøver
              </th>
              <th scope="col" className="px-6 py-3">
                Økt Navn
              </th>
              <th scope="col" className="px-6 py-3">
                Dato
              </th>
              <th scope="col" className="px-6 py-3">
                Se
              </th>
              <th scope="col" className="px-6 py-3">
                Rapporter
              </th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((workout) => (
              <React.Fragment key={workout.goalId}>
                <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-6 py-4">{formatUserId(workout.userId)}</td>
                  <td className="px-6 py-4">{workout.name}</td>
                  <td className="px-6 py-4">
                    {format(new Date(workout.date!), "dd.MM.yyyy", {
                      locale: nb,
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="mb-2 me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                      onClick={() => {
                        router.push(`/workout/${workout.goalId}`)
                      }}
                    >
                      <ViewIcon />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="mb-2 me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                      onClick={() => {
                        router.push(`/status/${workout.goalId}`)
                      }}
                    >
                      <ReportIcon />
                    </button>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default WorkoutList
