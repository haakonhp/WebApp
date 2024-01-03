"use client"

import React, { useState } from "react"

import { Question } from "@/types/question"
import { type QuestionVariant } from "@/types/stringVariants"

export default function NewQuestions({
  addQuestion,
}: {
  addQuestion?: (question: Question) => void
}) {
  // -------------- Add question Logikk ----------- //
  const [newQuestionText, setNewQuestionText] = useState("")
  const [newQuestionType, setNewQuestionType] =
    useState<QuestionVariant>("radio:mood")

  return (
    <>
      <h2 className="text-1xl mb-4 font-extrabold dark:text-white">
        Legg til nye spørsmål
      </h2>

      <div className="flex flex-col justify-between">
        <div>
          <div>
            <input
              type="text"
              value={newQuestionText}
              onChange={(e) => {
                setNewQuestionText(e.target.value)
              }}
              placeholder="Legg inn spørsmålstekst"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
            <select
              value={newQuestionType}
              onChange={(e) => {
                setNewQuestionType(e.target.value as QuestionVariant)
              }}
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            >
              <option value="radio:mood">Radio: Mood</option>
              <option value="radio:range">Radio: Range</option>
              <option value="text">Text</option>
            </select>
            <button
              onClick={() => {
                if (addQuestion) {
                  addQuestion({
                    question: newQuestionText,
                    type: newQuestionType,
                  })
                }
              }}
              className="mb-2 me-2 mt-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Legg til
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
