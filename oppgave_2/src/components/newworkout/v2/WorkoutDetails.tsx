"use client"

import React, { useState } from "react"
import { toast } from "react-toastify"
import type { Question } from "@/types/question"
import type { TemplateInsert } from "@/types/template"
import { useRouter } from "next/navigation"

import UserGoalsDropDown from "@/components/personalGoals/goals/UserGoalsDropDown"
import UserTournamentsDropDown from "@/components/personalTournaments/tournaments/UserTournamentsDropDown"
import AddWorkoutIntensity from "@/components/shared/AddWorkoutIntensity"
import Card from "@/components/shared/Card"
import { WorkoutIcon } from "@/components/shared/SharedIcons"
import ActivityCheckbox from "./ActivityCheckbox"
import AddNewQuestion from "./AddNewQuestion"
import TemplateQuestions from "./TemplateQuestions"

const WorkoutDetails = ({
  userId,
  template,
}: {
  userId: string
  template: TemplateInsert | null
}) => {
  const [inputDate, setDate] = useState<Date | undefined>(undefined)
  const [workoutName, setWorkoutName] = useState(template ? template.name : "")
  const [tags, setWorkoutTags] = useState(
    template ? template.tagsStringable : "",
  )
  const [intensityChecked, setIntensityChecked] = useState<boolean | undefined>(
    template ? template.intensityChecked : false,
  )
  const [wattChecked, setWattChecked] = useState<boolean | undefined>(
    template ? template.wattChecked : false,
  )
  const [speedChecked, setSpeedChecked] = useState<boolean | undefined>(
    template ? template.speedChecked : false,
  )
  const [heartrateChecked, setHeartrateChecked] = useState<boolean | undefined>(
    template ? template.heartrateChecked : false,
  )
  const [sport, setSport] = useState(template ? template.sport : "")
  const [tournamentId, setTournamentId] = useState<string | null>(null)
  const [personalGoalId, setPersonalGoalId] = useState<string | null>(null)
  const router = useRouter()

  const [intensityData, setIntensityData] = useState<
    {
      duration: number
      intensity: number
    }[]
  >([{ duration: 0, intensity: 0 }])

  const [questions, setQuestions] = useState<Question[] | null>(null)

  const [newQuestion, setNewQuestion] = useState<Question[]>([])

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value

    const parsedDate = selectedDate ? new Date(selectedDate) : undefined

    setDate(parsedDate)
  }

  console.log(template?.UserActivityInterval)
  const createNewWorkout = async () => {
    const payload = {
      userId,
      date: inputDate,
      name: workoutName,
      tags: tags.split(",").map((tag) => tag.trim()),
      intensityChecked,
      wattChecked,
      speedChecked,
      heartrateChecked,
      sport,
      template: template?.id,
      tournamentId,
      personalGoalId,
      intervals: template?.UserActivityInterval
        ? template.UserActivityInterval
        : intensityData,
      questions: template ? questions : newQuestion,
    }

    try {
      const response = await fetch(`/api/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        toast.error("Noe gikk galt. Kunne ikke lagre data")
      } else {
        toast.success("Velykket lagring av ny utøver data")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />

      <Card title="Økt detaljer" icon={WorkoutIcon}>
        <div className="mt-6 flex flex-col">
          <label
            htmlFor="workout"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Dato
          </label>
          <input
            type="date"
            name="date"
            id="date"
            value={
              inputDate instanceof Date
                ? inputDate.toISOString().split("T")[0]
                : ""
            }
            onChange={handleDateChange}
            className="w-400 mb-2 mr-6 rounded-md border p-2 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-200"
          />
          <label
            htmlFor="workout"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Økt navn
          </label>
          <input
            type="text"
            id="workout"
            onChange={(e) => {
              setWorkoutName(e.target.value)
            }}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            value={workoutName}
            required
          />

          <label
            htmlFor="workout"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Tag
          </label>
          <input
            type="text"
            id="workout"
            onChange={(e) => {
              setWorkoutTags(e.target.value)
            }}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            value={tags}
            required
          />
          <label
            htmlFor="workout"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Aktivitets Type
          </label>
          <input
            type="text"
            id="workout"
            onChange={(e) => {
              setSport(e.target.value)
            }}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            value={sport}
            required
          />
        </div>

        {!template && (
          <ActivityCheckbox
            intensityChecked={intensityChecked}
            setIntensityChecked={setIntensityChecked}
            wattChecked={wattChecked}
            setWattChecked={setWattChecked}
            speedChecked={speedChecked}
            setSpeedChecked={setSpeedChecked}
            heartrateChecked={heartrateChecked}
            setHeartrateChecked={setHeartrateChecked}
          />
        )}

        {!template && (
          <AddWorkoutIntensity
            intensityData={intensityData}
            setIntensityData={setIntensityData}
          />
        )}

        {template ? (
          <TemplateQuestions
            templateId={template.id}
            templateQuestions={questions}
            setTemplateQuestions={setQuestions}
          />
        ) : (
          <AddNewQuestion
            newQuestion={newQuestion}
            setNewQuestion={setNewQuestion}
          />
        )}

        <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />

        <UserGoalsDropDown
          setPersonalGoalId={setPersonalGoalId}
          userId={userId}
        />

        <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />

        <UserTournamentsDropDown
          setTournamentId={setTournamentId}
          userId={userId}
        />

        {personalGoalId && tournamentId && (
          <p>Du kan ikke ha både mål og turnering. Du må velge en av dem.</p>
        )}
      </Card>
      <button
        type="button"
        disabled={personalGoalId && tournamentId ? true : false}
        onClick={createNewWorkout}
        className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Lagre
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

export default WorkoutDetails
