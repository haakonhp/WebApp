"use client"

import React, { useEffect, useState } from "react"
import type { ActivityResponse } from "@/types/activity"

import WorkoutCard from "@/components/workout/WorkoutCard"
import WorkoutIntervalsCard from "@/components/workout/WorkoutIntervalsCard"

export default function Page({ params }: { params: { workoutId: string } }) {
  const workoutId = params.workoutId

  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-screen-sm flex-col p-4 sm:max-w-screen-lg sm:p-8">
        <WorkoutDashboard workoutId={workoutId} />
      </main>
    </>
  )
}

const WorkoutDashboard = ({ workoutId }: { workoutId: string }) => {
  const [workoutData, setWorkoutData] = useState<ActivityResponse | undefined>(
    undefined,
  )
  useEffect(() => {
    const fetchWorkoutDetails = async () => {
      try {
        const response = await fetch(`/api/activities/${workoutId}/reports`, {
          method: "get",
        })

        const result = (await response.json()) as {
          data: { data: ActivityResponse }
        }
        setWorkoutData(result.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    void fetchWorkoutDetails()
  }, [workoutId])

  if (workoutData === undefined) {
    return null
  }
  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col  gap-4">
          <WorkoutCard workoutData={workoutData} />
          <WorkoutIntervalsCard workoutData={workoutData} />
        </div>
      </div>
    </>
  )
}
