"use client"

import React from "react"
import { useRouter } from "next/navigation"

import AthletesList from "@/components/dashboard/AthletesList"
import WorkoutList from "@/components/dashboard/WorkoutsList"
import Card from "@/components/shared/Card"
import { AthleteIcon, WorkoutIcon } from "@/components/shared/SharedIcons"

export default function Home() {
  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-screen-sm flex-col p-4 sm:max-w-screen-lg sm:p-8">
        <h2 className="mb-6 text-4xl font-extrabold dark:text-white">
          Dashboard
        </h2>
        <Options />
        <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />

        <Card title="Utøvere" icon={AthleteIcon}>
          <AthletesList />
        </Card>
        <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />

        <Card title="Økter" icon={WorkoutIcon}>
          <WorkoutList />
        </Card>
      </main>
    </>
  )
}

const Options = () => {
  const router = useRouter()

  return (
    <>
      <div className="flex flex-row">
        <button
          type="button"
          onClick={() => {
            router.push(`/new_template`)
          }}
          className="mb-2 me-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          Ny treningsmal
        </button>
        <button
          type="button"
          onClick={() => {
            router.push(`/new_questions`)
          }}
          className="mb-2 me-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          Nye spørsmål
        </button>
        <button
          type="button"
          onClick={() => {
            router.push(`/new_athlete`)
          }}
          className="mb-2 me-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          Ny utøver
        </button>
      </div>
    </>
  )
}
