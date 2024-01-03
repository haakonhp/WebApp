import React, { useEffect, useState } from "react"
import format from "date-fns/format"
import { nb } from "date-fns/locale"

import Loading from "@/components/shared/Loading"

import type {Meta} from "@/types/user";

const PerformanceHistoryCard = ({ userId }: { userId: string }) => {
  const [performanceHistory, setPerformanceHistory] = useState<
    Meta[] | undefined
  >(undefined)

  useEffect(() => {
    const fetchPerformanceHistory = async () => {
      try {
        const response = await fetch(`/api/athletes/${userId}/metadata`, {
          method: "get",
        })

        const result = (await response.json()) as {
          data: { data: Meta[] }
        }
        setPerformanceHistory(result.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    void fetchPerformanceHistory()
  }, [userId])

  if (performanceHistory === undefined) {
    return <Loading />
  }
  return (
    <>
      <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Dato
            </th>
            <th scope="col" className="px-6 py-3">
              Puls
            </th>
            <th scope="col" className="px-6 py-3">
              Watt
            </th>
            <th scope="col" className="px-6 py-3">
              Hastighet
            </th>
          </tr>
        </thead>
        <tbody>
          {performanceHistory.map((item, index) => (
            <React.Fragment key={index}>
              <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                <td className="px-6 py-4">
                  {format(new Date(item.creation_time!), "dd.MM.yyyy", {
                    locale: nb,
                  })}
                </td>
                <td className="px-6 py-4">{item.heartrate}</td>
                <td className="px-6 py-4">{item.watt}</td>
                <td className="px-6 py-4">{item.speed}</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default PerformanceHistoryCard
