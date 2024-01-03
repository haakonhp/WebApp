import React, { useEffect, useState } from "react"
import type { Goal } from "@/types/baseTypes"

import AlertCard from "@/components/shared/AlertCard"

const UserGoalsDropDown = ({
  setPersonalGoalId,
  userId,
}: {
  setPersonalGoalId: React.Dispatch<React.SetStateAction<string | null>>
  userId: string
}) => {
  const [goals, setGoals] = useState<Goal[] | null>(null)

  useEffect(() => {
    void fetchGoals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const fetchGoals = async () => {
    try {
      const response = await fetch(`/api/athletes/${userId}/goals/`, {
        method: "get",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = (await response.json()) as {
        data: { data: Goal[] | null }
      }
      setGoals(result.data.data)
    } catch (error) {
      console.error("API error Goals:", error)
    }
  }

  if (goals === null) {
    return (
      <AlertCard
        title="Ingen personlige mål funnet"
        description="Legg til nye"
      />
    )
  } else {
    return (
      <>
        <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />

        <h2 className="mb-6 text-xl font-extrabold dark:text-white">
          Personlige mål
        </h2>
        <div className="flex flex-row justify-start">
          <select
            id="countries"
            className="mb-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            onChange={(event) => {
              const selectedValue = event.target.value
              setPersonalGoalId(selectedValue === "null" ? null : selectedValue)
            }}
          >
            <option value="null">Ingen</option>
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id.toString()}>
                {goal.name}
              </option>
            ))}
          </select>
        </div>
      </>
    )
  }
}

export default UserGoalsDropDown
