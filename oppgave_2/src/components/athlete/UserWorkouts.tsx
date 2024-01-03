/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import { useRouter } from "next/navigation"

import "react-datepicker/dist/react-datepicker.css"

import { toast } from "react-toastify"
import type { ActivityResponse } from "@/types/activity"

import generateExcel from "@/utils/generateExcel"
import DarkAlert from "../shared/AlertCard"
import Card from "../shared/Card"
import Loading from "../shared/Loading"
import {
  DeleteIcon,
  DuplicateIcon,
  ExcelIcon,
  ReportIcon,
  ViewIcon,
} from "../shared/SharedIcons"

const UserWorkouts = ({ userId }: { userId: string }) => {
  const router = useRouter()

  return (
    <Card title="Økter" icon={UserWorkoutsIcon}>
      <UserWorkOutInfo userId={userId} />

      <button
        type="button"
        onClick={() => {
          router.push(`/new_workout/${userId}`)
        }}
        className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Ny økt
      </button>
    </Card>
  )
}

const UserWorkoutsIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 32 32"
      className="mr-6"
    >
      <path
        fill="currentColor"
        d="M25 23h-.021a1.002 1.002 0 0 1-.94-.726L20.87 11.19l-1.935 5.16A1 1 0 0 1 18 17h-4v-2h3.307l2.757-7.351a1 1 0 0 1 1.898.076l3.111 10.892l1.979-5.933A.999.999 0 0 1 28 12h4v2h-3.28l-2.772 8.316A.998.998 0 0 1 25 23zm-10 7h-2v-7a3.003 3.003 0 0 0-3-3H6a3.003 3.003 0 0 0-3 3v7H1v-7a5.006 5.006 0 0 1 5-5h4a5.006 5.006 0 0 1 5 5zM8 8a3 3 0 1 1-3 3a3 3 0 0 1 3-3m0-2a5 5 0 1 0 5 5a5 5 0 0 0-5-5z"
      />
    </svg>
  )
}

const UserWorkOutInfo = ({ userId }: { userId: string }) => {
  const [userActivities, setUserActivities] = useState<
    ActivityResponse[] | undefined | null
  >(undefined)

  const router = useRouter()

  const fetchUserActivitiesData = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/athletes/${userId}/activities`, {
        method: "get",
      })

      const result = (await response.json()) as {
        data: { data: ActivityResponse[] }
      }
      setUserActivities(result.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const duplicateActivity = async (workoutId: string) => {
    try {
      const response = await fetch(`/api/activities/${workoutId}/duplicate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      toast.loading("Dupliserer økten...")

      if (!response.ok) {
        toast.dismiss()
        toast.error("Kunne ikke duplisere økt")
      } else {
        toast.dismiss()
        toast.success("Økten er duplisert")

        await fetchUserActivitiesData()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteActivity = async (workoutId: string) => {
    try {
      const response = await fetch(`/api/activities/${workoutId}`, {
        method: "DELETE",
      })

      toast.loading("Sletter økten...")
      if (!response.ok) {
        toast.dismiss()
        toast.error("Kunne ikke slette økten")
      } else {
        toast.dismiss()
        toast.success("Økten er slettet")
        await fetchUserActivitiesData()
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    void fetchUserActivitiesData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const [activityFilter, setActivityFilter] = useState<string>("")
  const [reportFilter, setReportFilter] = useState<string>("")
  const [dateFilter, setDateFilter] = useState<string>("")

  if (userActivities === undefined) {
    return <Loading />
  }
  if (userActivities === null) {
    return (
      <DarkAlert
        title="Ingen økter registrert"
        description="Registrer en ny økt"
      />
    )
  } else {
    const filteredList = userActivities.filter(
      (activity) =>
        (activityFilter
          ? activity.sport?.toLowerCase().includes(activityFilter.toLowerCase())
          : true) &&
        (reportFilter
          ? activity.activityReport?.[0]?.status
              .toLowerCase()
              .includes(reportFilter.toLowerCase())
          : true) &&
        (dateFilter ? activity.date?.includes(dateFilter) : true),
    )

    return (
      <>
        <button
          type="button"
          onClick={() => {
            router.push(`/evaluation/${userId}`)
          }}
          className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Evaluering
        </button>
        <div className="mb-6 mt-6 flex flex-row gap-6">
          <p>Filtrer:</p>
          <FilterByActivity setActivityFilter={setActivityFilter} />
          <FilterByReport setReportFilter={setReportFilter} />
          <FilterByDate setDateFilter={setDateFilter} />
        </div>
        <div className="relative mb-6 max-h-96 overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">
                  Økt Navn
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">
                  Sport
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">
                  Status
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">
                  Se
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">
                  Dupliser
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">
                  Excel
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">
                  Rapporter/Endre
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">
                  Slett
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item) => (
                <React.Fragment key={item.goalId}>
                  <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                    <td className="px-3 py-2 sm:px-6 sm:py-4">{item.name}</td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4">{item.sport}</td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4">
                      {item.activityReport?.[0]?.status ?? "Ingen"}
                    </td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4">
                      <button
                        type="button"
                        onClick={() => {
                          router.push(`/workout/${item.goalId}`)
                        }}
                        className="mb-2 me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                      >
                        <ViewIcon />
                      </button>
                    </td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4">
                      <button
                        type="button"
                        onClick={() => {
                          void duplicateActivity(item.goalId)
                        }}
                        className="mb-2 me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                      >
                        <DuplicateIcon />
                      </button>
                    </td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4">
                      <button
                        type="button"
                        disabled={!item.activityReport?.[0]?.status}
                        onClick={() => {
                          generateExcel(item)
                        }}
                        className="mb-2 me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                      >
                        <ExcelIcon />{" "}
                      </button>
                    </td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4">
                      <button
                        type="button"
                        onClick={() => {
                          router.push(`/status/${item.goalId}`)
                        }}
                        className="mb-2 me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                      >
                        <ReportIcon />
                      </button>
                    </td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4">
                      <button
                        type="button"
                        onClick={() => {
                          void deleteActivity(item.goalId)
                        }}
                        className="mb-2 me-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                      >
                        <DeleteIcon />
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
}

const FilterByActivity = ({
  setActivityFilter,
}: {
  setActivityFilter: React.Dispatch<React.SetStateAction<string>>
}) => {
  const [sports, setSports] = useState<string[] | undefined | null>(undefined)
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/sports`, { method: "GET" })

        const result = (await response.json()) as { data: { data: string[] } }
        setSports(result.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    void fetchActivities()
  }, [])

  if (sports === undefined || sports === null) {
    return null
  } else {
    return (
      <>
        <div>
          <select
            id="sports"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          >
            <option
              onClick={() => {
                setActivityFilter("")
              }}
              value={undefined}
            >
              Alle Aktiviteter
            </option>
            {sports.map((activities) => (
              <option
                onClick={(e) => {
                  setActivityFilter(e.currentTarget.value)
                }}
                key={activities}
                value={activities}
              >
                {activities}
              </option>
            ))}
          </select>
        </div>
      </>
    )
  }
}

const FilterByReport = ({
  setReportFilter,
}: {
  setReportFilter: React.Dispatch<React.SetStateAction<string>>
}) => {
  return (
    <>
      <div>
        <select
          id="countries"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        >
          <option
            onClick={() => {
              setReportFilter("")
            }}
            value={undefined}
          >
            Rapport
          </option>
          <option
            onClick={() => {
              setReportFilter("No")
            }}
            value="No"
          >
            No
          </option>
          <option
            onClick={() => {
              setReportFilter("Low")
            }}
            value="Low"
          >
            Low
          </option>
          <option
            onClick={() => {
              setReportFilter("Normal")
            }}
            value="Normal"
          >
            Normal
          </option>
          <option
            onClick={() => {
              setReportFilter("High")
            }}
            value="High"
          >
            High
          </option>
        </select>
      </div>
    </>
  )
}

const FilterByDate = ({
  setDateFilter,
}: {
  setDateFilter: React.Dispatch<React.SetStateAction<string>>
}) => {
  return (
    <>
      <input
        type="date"
        name="date"
        id="date"
        onChange={(e) => {
          setDateFilter(e.target.value)
        }}
        className="w-400 mb-2 mr-6 rounded-md border p-2 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-200"
      />
    </>
  )
}

export default UserWorkouts
