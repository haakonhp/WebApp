"use client"

import React, { useEffect, useState } from "react"
import type { User } from "@/types/user"
import { useRouter } from "next/navigation"

import { formatUserId } from "@/features/ReusableFunction/formatUserId"
import AlertCard from "../shared/AlertCard"
import Loading from "../shared/Loading"
import { ReportIcon, ViewIcon } from "../shared/SharedIcons"

const AthletesList = () => {
  const [search, setSearch] = useState<string>("")
  const [athletes, setAthletes] = useState<User[] | null | undefined>(undefined)
  const router = useRouter()

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const response = await fetch(`/api/athletes/`, {
          method: "get",
        })
        const result = (await response.json()) as { data: { data: User[] } }
        setAthletes(result.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    void fetchAthletes()
  }, [])

  if (athletes === undefined) {
    return <Loading />
  }
  if (athletes === null) {
    return (
      <AlertCard title={"Fant ingen utøvere"} description={"Lag nye utøvere"} />
    )
  }

  const filteredList = athletes.filter((athlete) =>
    search ? athlete.userId.toLowerCase().includes(search.toLowerCase()) : true,
  )

  return (
    <>
      {" "}
      <SearchAthlete search={search} setSearch={setSearch} />
      <div className="relative mb-6 max-h-96 overflow-x-auto">
        <div className="mb-6"></div>
        <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Utøver
              </th>
              <th scope="col" className="px-6 py-3">
                Økter
              </th>
              <th scope="col" className="px-6 py-3">
                Rapporter
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((athlete) => (
              <React.Fragment key={athlete.id}>
                <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-6 py-4">{formatUserId(athlete.userId)}</td>
                  <td className="px-6 py-4">
                    <button
                      className="mb-2 me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                      onClick={() => {
                        router.push(`/athlete/${athlete.userId}`)
                      }}
                    >
                      <ViewIcon />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="mb-2 me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                      onClick={() => {
                        router.push(`/athlete/${athlete.userId}/reports`)
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

const SearchAthlete = ({
  search,
  setSearch,
}: {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}) => {
  return (
    <>
      <div className="mb-3 flex flex-row">
        <input
          type="text"
          placeholder="Søk etter en utøver"
          value={search || ""}
          onChange={(e) => {
            setSearch(e.target.value)
          }}
          className="w-400 mr-6 rounded-md border p-2 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>
    </>
  )
}
export default AthletesList
