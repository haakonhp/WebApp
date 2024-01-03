"use client"

import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import type { Goal } from "@/types/baseTypes"

import AthleteCard from "@/components/athlete/athleteData/AthleteCard"
import UserGoalsTable from "@/components/personalGoals/goals/UserGoalsTable"
import NewGoal from "@/components/personalGoals/newgoal/NewGoal"

// TODO: fikse params NewGoal

export default function Page({ params }: { params: { userId: string } }) {
  const userId = params.userId

  const [goals, setGoals] = useState<Goal[] | undefined | null>(undefined)

  useEffect(() => {
    void fetchGoals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const fetchGoals = async () => {
    try {
      const response = await fetch(`/api/athletes/${userId}/goals/`, {
        //Denne må være dynamisk
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
      toast.error(
        "Feil ved henting av Treningsmål / Ingen Treningsmål lagt inn",
      )
      console.error("API error Goals:", error)
    }
  }
  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-screen-sm flex-col p-4 sm:max-w-screen-lg sm:p-8">
        <h1 className="mb-6 text-4xl font-extrabold dark:text-white">
          Opprett nytt treningsmål
        </h1>
        <AthleteCard userId={userId} isEditable={false} />
        <NewGoal params={{ userId, fetchGoals }} />
        <hr className="my-5 h-px border-0 bg-gray-200 dark:bg-gray-700" />

        {goals && <UserGoalsTable goals={goals} />}
      </main>
    </>
  )
}
