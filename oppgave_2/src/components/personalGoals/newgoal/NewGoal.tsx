"use client"

import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function NewGoal({
  params,
}: {
  params: { userId: string; fetchGoals: () => Promise<void> }
}) {
  const userId = params.userId
  const fetchGoals = params.fetchGoals

  /// -------------------------------------------- ///
  // -------------- Input Box logic --------------- //
  const [inputWorkoutName, setWorkoutName] = useState<string>("")
  const [inputDate, setDate] = useState("")
  const [inputGoal, setGoal] = useState<number>()
  const [inputComment, setComment] = useState<string>("")

  /// ------------------------------------------------ //
  //-------------- ADD new goal via API to database  --------- //
  const sendGoal = async () => {
    const requestBody = {
      name: inputWorkoutName,
      date: new Date(),
      goal: Number(inputGoal),
      comment: inputComment,
      userId: userId,
    }

    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      toast.success("Treningsmål lagt til!")
      resetForm()
      void fetchGoals()
    } catch (error) {
      console.error("Error:", error)
      toast.error("Feil ved å legge til mål")
    }
  }
  /// ------------------------------------------------ //
  // ------------ Reset skjema Logic ----------------- //
  const resetForm = () => {
    setWorkoutName("")
    setGoal(Number(undefined))
    setComment("")
    setDate("")
  }
  /// ------------------------------------------------ //
  return (
    <>
      <div className="mb-2 flex flex-col justify-between">
        <h3 className="text-1xl mb-2 font-extrabold dark:text-white">Navn:</h3>
        {/*------ INPUT Name-------*/}
        <input
          type="text"
          name="workoutName"
          id="workoutName"
          placeholder="f.eks. styrke trening"
          value={inputWorkoutName}
          onChange={(e) => {
            setWorkoutName(e.currentTarget.value)
          }}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>
      <div className="mb-2 flex flex-col justify-between">
        <h3 className="text-1xl mb-2 font-extrabold dark:text-white">Dato:</h3>
        {/*------ INPUT Date -------*/}
        <input
          type="date"
          name="date"
          id="date"
          value={inputDate}
          onChange={(e) => {
            setDate(e.currentTarget.value)
          }}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>
      <div className="mb-2 flex flex-col justify-between">
        <h3 className="text-1xl mb-2 font-extrabold dark:text-white">Mål:</h3>
        {/*------ INPUT Goal -------*/}
        <input
          type="number"
          name="goal"
          id="goal"
          placeholder="fyll inn ett tall"
          value={inputGoal}
          onChange={(e) => {
            setGoal(parseInt(e.currentTarget.value))
          }}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>
      <div className="mb-2 flex flex-col justify-between">
        <h3 className="text-1xl mb-2 font-extrabold dark:text-white">
          Kommentar:
        </h3>
        {/*------ INPUT Comment -------*/}
        <input
          type="text"
          name="comment"
          id="comment"
          placeholder="f.eks. husk å sammenligne med ifjor"
          value={inputComment}
          onChange={(e) => {
            setComment(e.currentTarget.value)
          }}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>

      <hr className="my-5 h-px border-0 bg-gray-200 dark:bg-gray-700" />

      <div className="flex flex-row justify-start">
        <button
          type="button"
          onClick={sendGoal}
          className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Legg til treningsmål
        </button>
      </div>
    </>
  )
}
