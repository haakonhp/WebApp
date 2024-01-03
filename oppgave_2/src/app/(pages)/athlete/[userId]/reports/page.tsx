"use client"

import React, { useEffect, useState } from "react"
import type { AllUserReports } from "@/types/baseTypes"
import { format } from "date-fns"
import nb from "date-fns/locale/nb"
import { useRouter } from "next/navigation"

import AlertCard from "@/components/shared/AlertCard"
import Loading from "@/components/shared/Loading"

export function Page({ params }: { params: { userId: string } }) {
  const userId = params.userId

  const [reports, setReports] = useState<AllUserReports[] | null | undefined>(
    undefined,
  )

  const router = useRouter()

  useEffect(() => {
    const fetchUserReports = async () => {
      try {
        const response = await fetch(`/api/athletes/${userId}/reports`, {
          method: "GET",
        })
        const result = (await response.json()) as {
          data: { data: AllUserReports[] }
        }
        setReports(result.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    void fetchUserReports()
  }, [userId])

  if (reports === undefined) {
    return <Loading />
  }

  if (reports === null) {
    return (
      <AlertCard
        title="Fant ingen rapporter"
        description="Denne brukeren har ikke registrert noen rapporter"
      />
    )
  } else {
    return (
      <>
        <main className="mx-auto flex min-h-screen max-w-screen-sm flex-col p-4 sm:max-w-screen-lg sm:p-8">
          <h2 className="mb-6 text-xl font-extrabold dark:text-white">
            Alle rapporter for: {userId}
          </h2>
          <div className="relative overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Økt navn
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Dato
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Se
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        {item.UserActivity.name}
                      </th>
                      <td className="px-6 py-4">
                        {format(new Date(item.createdAt!), "dd.MM.yyyy", {
                          locale: nb,
                        })}
                      </td>
                      <td className="px-6 py-4">{item.status}</td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => {
                            router.push(`/status/${item.UserActivity.goalId}`)
                          }}
                          className="mb-2 me-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                          Se
                        </button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </>
    )
  }
}

export default Page
