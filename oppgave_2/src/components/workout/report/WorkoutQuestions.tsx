"use client"

import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"

import AlertCard from "@/components/shared/AlertCard"

type Questions = {
  id: string
  question: string
  type: string
  answer: string
  connectedActivity: string
}
const WorkoutQuestions = ({ workoutId }: { workoutId: string }) => {
  const [questions, setQuestions] = useState<Questions[] | null>(null)

  const [step, setStep] = useState<number>(0)

  const fetchWorkoutQuestions = async () => {
    try {
      const response = await fetch(`/api/activities/${workoutId}/questions`, {
        method: "GET",
      })
      const result = (await response.json()) as {
        data: { data: Questions[] }
      }
      setQuestions(result.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    void fetchWorkoutQuestions()
  }, [workoutId])

  const sendAnswers = async (questionId: string, answer: string) => {
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer }),
      })
      if (!response.ok) {
        toast.error("Noe gikk galt. Kunne ikke lagre spørsmål")
      } else {
        toast.success("Velykket lagring av spørsmål")
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (questions === null) {
    return null
  }
  if (questions.length === 0) {
    return <AlertCard title="Fant ingen spørsmål" description="" />
  } else {
    return (
      <>
        <p>
          {step + 1} / {questions.length}
        </p>
        <p className="mb-6">Husk å trykke lagre for hver spørsmål du svarer.</p>

        <QuestionBox
          index={step + 1}
          fetchWorkoutQuestions={fetchWorkoutQuestions}
          item={questions[step]}
          sendAnswers={sendAnswers}
        />
        <div className="mt-6 flex flex-row">
          {step > 0 && (
            <button
              type="button"
              onClick={() => {
                setStep((prev) => prev - 1)
              }}
              className="mb-2 me-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            >
              Back
            </button>
          )}

          {step + 1 < questions.length && (
            <button
              type="button"
              onClick={() => {
                setStep((prev) => prev + 1)
              }}
              className="mb-2 me-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            >
              Neste
            </button>
          )}
        </div>
      </>
    )
  }
}

const QuestionBox = ({
  index,
  item,
  fetchWorkoutQuestions,
  sendAnswers,
}: {
  index: number
  item: Questions
  sendAnswers: (questionId: string, answer: string) => Promise<void>
  fetchWorkoutQuestions: () => Promise<void>
}) => {
  const [questionAnswer, setQuestionAnswer] = useState<string>("")

  const setCheckBoxAnswer = (inputAnswer: string) => {
    setQuestionAnswer(inputAnswer)
  }

  useEffect(() => {
    setCheckBoxAnswer(item.answer)
  }, [item])

  return (
    <>
      <h1 className="flex items-center text-2xl font-extrabold dark:text-white">
        Spørsmål
        <span className="me-2 ms-2 rounded bg-blue-100 px-2.5 py-0.5 text-xl font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800">
          {index}
        </span>
      </h1>

      <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />

      <p>{item.question}</p>
      <QuestionInput
        inputType={item.type}
        answer={questionAnswer}
        setCheckBoxAnswer={setCheckBoxAnswer}
      />

      <button
        type="button"
        onClick={() => {
          void sendAnswers(item.id, questionAnswer)
          void fetchWorkoutQuestions()
        }}
        className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Lagre
      </button>
    </>
  )
}

const QuestionInput = ({
  inputType,
  answer,
  setCheckBoxAnswer,
}: {
  inputType: string
  answer: string
  setCheckBoxAnswer: (answer: string) => void
}) => {
  if (inputType === "radio:range") {
    const radioButtons = []

    // Utnytter en for loop for å generere 10 radio buttons
    for (let radionr = 1; radionr <= 10; radionr++) {
      radioButtons.push(
        <div key={radionr} className="mb-4 flex items-center">
          <input
            id={`default-radio-${radionr}`}
            type="radio"
            value={radionr}
            name="default-radio"
            checked={answer === radionr.toString()}
            onChange={() => {
              setCheckBoxAnswer(radionr.toString())
            }}
            className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
          />
          <label
            htmlFor={`default-radio-${radionr}`}
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            {radionr}
          </label>
        </div>,
      )
    }

    return <div>{radioButtons}</div>
  }

  if (inputType === "text") {
    return (
      <>
        <div>
          <label
            htmlFor="first_name"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Svar:
          </label>
          <input
            type="text"
            value={answer}
            onChange={(e) => {
              setCheckBoxAnswer(e.currentTarget.value)
            }}
            id="first_name"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Svar"
            required
          />
        </div>
      </>
    )
  }

  if (inputType === "radio:mood") {
    const moods = [
      { value: "worse", label: "☹️ Dårligere enn normalt" },
      { value: "normal", label: "😐 Normalt" },
      { value: "better", label: "😀 Bedre enn normalt" },
    ]

    return (
      <>
        {moods.map((items) => (
          <div key={items.value} className="mb-4 flex items-center">
            <input
              id={`mood-radio-${items.value}`}
              type="radio"
              value={items.value}
              name="mood-radio"
              checked={answer === items.value}
              onChange={() => {
                setCheckBoxAnswer(items.value)
              }}
              className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            />
            <label
              htmlFor={`mood-radio-${items.value}`}
              className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {items.label}
            </label>
          </div>
        ))}
      </>
    )
  }
}

export default WorkoutQuestions
