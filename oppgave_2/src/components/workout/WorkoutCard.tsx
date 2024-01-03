"use client"

import React, { useEffect, useState } from "react"
import type { ActivityResponse } from "@/types/activity"
import format from "date-fns/format"
import nb from "date-fns/locale/nb"
import { useRouter } from "next/navigation"

import Card from "../shared/Card"
import Loading from "../shared/Loading"
import { WorkoutIcon } from "../shared/SharedIcons"

const WorkoutCard = ({ workoutData }: { workoutData: ActivityResponse }) => {
  return (
    <Card title="Økt detaljer" icon={WorkoutIcon}>
      <WorkoutInfo workoutData={workoutData} />
    </Card>
  )
}

const WorkoutInfo = ({
  workoutData,
}: {
  workoutData: ActivityResponse | undefined
}) => {
  const router = useRouter()

  if (workoutData === undefined) {
    return <Loading />
  } else
    return (
      <>
        <span className="me-2 rounded bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          {workoutData.name}
        </span>
        <p>Navn: {workoutData.userId}</p>
        <p>Sport: {workoutData.sport}</p>
        <p>
          Økt Dato:{" "}
          {format(new Date(workoutData.date!), "dd.MM-yyyy", {
            locale: nb,
          })}
        </p>
        <p>
          Status:{" "}
          {workoutData.activityReport?.[0]?.status ?? "Ingen status enda"}
        </p>
        <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />
        <button
          type="button"
          onClick={() => {
            router.push(`/athlete/${workoutData.userId}`)
          }}
          className="mb-2 me-2 mt-4 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Tilbake til utøver profil
        </button>
      </>
    )
}

export default WorkoutCard
