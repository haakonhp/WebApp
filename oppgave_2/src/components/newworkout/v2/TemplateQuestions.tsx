import React, { useEffect } from "react"

import AlertCard from "@/components/shared/AlertCard"
import { Question } from "@/types/question"
import QuestionTable from "./QuestionTable"

const TemplateQuestions = ({
  templateId,
  templateQuestions,
  setTemplateQuestions,
}: {
  templateId: string
  templateQuestions: Question[] | null
  setTemplateQuestions: React.Dispatch<React.SetStateAction<Question[] | null>>
}) => {
  useEffect(() => {
    const fetchTemplateQuestions = async () => {
      try {
        const response = await fetch(`/api/templates/${templateId}`, {
          method: "GET",
        })

        const result = (await response.json()) as {
          data: { data: Question[] }
        }

        setTemplateQuestions(result.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    void fetchTemplateQuestions()
  }, [])

  if (templateQuestions === null) {
    return (
      <AlertCard
        title="Fant ingen spørsmål"
        description="Legg til spørsmål i templates"
      />
    )
  }
  return (
    <>
      <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />
      <h2 className="mb-6 text-xl font-extrabold dark:text-white">Spørsmål</h2>
      <QuestionTable questions={templateQuestions} />
    </>
  )
}

export default TemplateQuestions
