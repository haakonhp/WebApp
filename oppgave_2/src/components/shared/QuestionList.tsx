"use client"

import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react"
import {toast} from "react-toastify";
import {type Question} from "@/types/question";

// TODO: sidebladrer for tabell

const QuestionList = forwardRef((props, ref) => {
  // TODO: HENT IFRA TEMPLATE QUESTION MED KUN SAMME ID SOM TEMPLATEN
  // -------------- API hent alle spørsmål ----------- //
  const [allTemplateQuestions, setQuestions] = useState<
    Question[] | undefined | null
  >(undefined)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/templates/expanded`, {
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
    fetchQuestions()
  }, [])
  /// ------------------------------------------------ //
  // -------------- Send questions til parent -------- //
  const [totalQuestions, setTotalQuestions] = useState<Question[]>([])

  useImperativeHandle(ref, () => ({
    getQuestions: () => {
      return [totalQuestions]
    },
  }))
  /// ------------------------------------------------ //
  return (
    <>
      <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />

      <h2 className="mb-6 text-2xl font-extrabold dark:text-white">
        Spørsmål:
      </h2>
      {/*------ QUESTION TABLE  -------*/}
      <div className="relative mb-6 overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Spørsmål
              </th>
              <th scope="col" className="px-6 py-3">
                Type
              </th>
            </tr>
          </thead>
          <tbody>
            {questions?.map((question) => (
              <React.Fragment key={question.id}>
                <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-6 py-4">{question.question}</td>
                  <td className="px-6 py-4">{question.type}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
})
export default QuestionList
