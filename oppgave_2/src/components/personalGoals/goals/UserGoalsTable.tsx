"use client"

import React from "react"
import type { Goal } from "@/types/baseTypes"
import { format } from "date-fns"
import nb from "date-fns/locale/nb"

const UserGoalsTable = ({ goals }: { goals: Goal[] }) => {
  return (
    <>
      <h2 className="mb-6 text-2xl font-extrabold dark:text-white">
        Treningsmål:
      </h2>
      <div className="relative mb-6 overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Navn
              </th>
              <th scope="col" className="px-6 py-3">
                Mål
              </th>
              <th scope="col" className="px-6 py-3">
                Dato
              </th>
              <th scope="col" className="px-6 py-3">
                Kommentar
              </th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal) => (
              <React.Fragment key={goal.id}>
                <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-6 py-4">{goal.name}</td>
                  <td className="px-6 py-4">{goal.goal}</td>
                  <td className="px-6 py-4">
                    {format(new Date(goal.date), "dd.MM.yyyy", {
                      locale: nb,
                    })}
                  </td>
                  <td className="px-6 py-4">{goal.comment}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default UserGoalsTable
