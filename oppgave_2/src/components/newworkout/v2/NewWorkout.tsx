"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

import NewWorkoutByTemplate from "./NewWorkoutByTemplate"
import WorkoutDetails from "./WorkoutDetails"

const NewWorkout = ({ userId }: { userId: string }) => {
  const [currentView, setCurrentView] = useState<"template" | "scratch" | null>(
    null,
  )
  const router = useRouter()

  if (currentView === "template") {
    return (
      <>
        <NewWorkoutByTemplate userId={userId} />
      </>
    )
  }
  if (currentView === "scratch") {
    return (
      <>
        <WorkoutDetails userId={userId} template={null} />
      </>
    )
  } else {
    return (
      <>
        <button
          type="button"
          onClick={() => {
            setCurrentView("template")
          }}
          className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Lag økt fra mal
        </button>
        <button
          type="button"
          onClick={() => {
            setCurrentView("scratch")
          }}
          className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Lag økt fra bunnen
        </button>
        <button
          type="button"
          onClick={() => {
            router.push(`/athlete/${userId}`)
          }}
          className="mb-2 me-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          Tilbake til utøver profil
        </button>
      </>
    )
  }
}

export default NewWorkout
