"use client"

import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

import Card from "@/components/shared/Card"
import { ReportIcon } from "@/components/shared/SharedIcons"
import WorkoutComment from "@/components/workout/report/WorkoutComment"
import WorkoutQuestions from "@/components/workout/report/WorkoutQuestions"
import WorkoutStatus from "@/components/workout/report/WorkoutStatus"
import WorkoutIntervalsCard from "@/components/workout/WorkoutIntervalsCard"
import { ActivityResponse } from "@/types/activity"

const Page = ({ params }: { params: { workoutId: string } }) => {
  const workoutId = params.workoutId

  const [status, setStatus] = useState<string>("")
  const [comment, setComment] = useState<string>("")

  const [workoutData, setWorkoutData] = useState<ActivityResponse | undefined>(
    undefined,
  )

  const router = useRouter()

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

        if (result.data.data.activityReport?.[0]?.comment) {
          setComment(result.data.data.activityReport[0].comment)
        }

        if (result.data.data.activityReport?.[0]?.status) {
          setStatus(result.data.data.activityReport[0].status)
        }
      } catch (error) {
        console.log(error)
      }
    }
    void fetchWorkoutDetails()
  }, [workoutId])

  const sendReport = async () => {
    const payload = {
      status,
      connectedActivity: workoutId,
      createdAt: new Date(),
      comment,
    }

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        toast.error("En feil har oppstått ved rapportering")
        return
      }

      toast.success("Lagret rapport")
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-screen-md flex-col p-4 md:max-w-screen-lg md:p-8">
        <button
          type="button"
          onClick={() => {
            router.push(`/workout/${workoutData?.goalId}`)
          }}
          className="mb-2 me-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          Tilbake til økt
        </button>
        <button
          type="button"
          onClick={() => {
            router.push(`/athlete/${workoutData?.userId}`)
          }}
          className="mb-2 me-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          Tilbake til utøver
        </button>
        <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />
        <h2 className="mb-6 text-xl font-extrabold dark:text-white">
          1. Sett status på økten
        </h2>
        <Card title="Økt status" icon={ReportIcon}>
          <WorkoutStatus status={status} setStatus={setStatus} />
        </Card>

        <h2 className="mb-6 text-xl font-extrabold dark:text-white">
          2. Sett intervall data
        </h2>
        <WorkoutIntervalsCard workoutData={workoutData} isEditable={true} />

        <h2 className="mb-6 text-xl font-extrabold dark:text-white">
          3. Svar på spørsmål fra økten
        </h2>
        <Card title="Økt spørsmål" icon={ReportIcon}>
          <WorkoutQuestions workoutId={workoutId} />
        </Card>

        <h2 className="mb-6 text-xl font-extrabold dark:text-white">
          4. Sett kommentar på økten
        </h2>
        <Card title="Økt kommentar" icon={ReportIcon}>
          <WorkoutComment
            comment={comment}
            workoutData={workoutData}
            setComment={setComment}
          />
        </Card>

        <button
          type="button"
          onClick={() => {
            void sendReport()
          }}
          className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Lagre rapport
        </button>
      </main>
    </>
  )
}

export default Page
