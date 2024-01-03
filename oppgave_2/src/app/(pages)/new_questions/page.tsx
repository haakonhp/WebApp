"use client"

import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

import NewQuestions from "@/components/newquestions/NewQuestions"
import NewTemplateQuestions from "@/components/newquestions/NewTemplateQuestions"
import QuestionTable from "@/components/newworkout/v2/QuestionTable"
import { Question } from "@/types/question"

export default function Page() {
  const router = useRouter()
  // -------------- API hent alle spørsmål ----------- //
  const [questions, setQuestions] = useState<Question[] | null | undefined>(
    undefined,
  )
  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/templatequestions`, {
        method: "get",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = (await response.json()) as {
        data: { data: Question[] | null }
      }
      setQuestions(result.data.data)
    } catch (error) {
      toast.error("Feil ved henting av Spørsmål / Ingen spørsmål funnet")
      console.error("API error Template Questions:", error)
    }
  }
  useEffect(() => {
    void fetchQuestions()
  }, [])
  /// ------------------------------------------------ //
  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-screen-sm flex-col p-4 sm:max-w-screen-lg sm:p-8">
        <h1 className="mb-6 text-4xl font-extrabold dark:text-white">
          Opprette nye spørsmål
        </h1>
        <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />
        <NewTemplateQuestions fetchQuestions={fetchQuestions} />
        <QuestionTable questions={questions} />
        <button
          type="button"
          onClick={() => {
            router.push(`/`)
          }}
          className="mb-2 me-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          Tilbake til Dashboard
        </button>
      </main>
    </>
  )
}
