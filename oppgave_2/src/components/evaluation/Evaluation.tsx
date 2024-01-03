"use client"

import React, { useEffect, useState } from "react"
import type { TemplateResponse } from "@/types/template"
import { useRouter } from "next/navigation"

import { formatUserId } from "@/features/ReusableFunction/formatUserId"
import Card from "../shared/Card"
import Loading from "../shared/Loading"
import { EvaluationIcon } from "../shared/SharedIcons"
import EvaluationTable from "./EvaluationTable"

export default function Evaluation({ userId }: { userId: string }) {
  return (
    <Card title="Evaluering" icon={EvaluationIcon}>
      <p>Navn: {formatUserId(userId)}</p>
      <EvaluationInfo userId={userId} />
    </Card>
  )
}

const EvaluationInfo = ({ userId }: { userId: string }) => {
  const router = useRouter()
  const [templates, setTemplates] = useState<
    TemplateResponse[] | null | undefined
  >(undefined)

  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(
    undefined,
  )
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`/api/templates/user/${userId}`, {
          method: "GET",
        })
        const result = (await response.json()) as {
          data: { data: TemplateResponse[] }
        }
        setTemplates(result.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    void fetchTemplates()
  }, [userId])

  if (templates === undefined) {
    return <Loading />
  }
  if (templates === null) {
    return <p>Fant ingen registrerte maler</p>
  } else {
    return (
      <>
        <select
          id="countries"
          className="mb-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          onChange={(event) => {
            const selectedTemplateId = event.target.value
            setSelectedTemplate(selectedTemplateId)
          }}
        >
          <option value={undefined}>Velg mal</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>

        {selectedTemplate && (
          <EvaluationTable
            userId={userId}
            selectedTemplate={selectedTemplate}
          />
        )}
        <button
          type="button"
          onClick={() => {
            router.push(`/athlete/${userId}`)
          }}
          className="mb-2 me-2 mt-4 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Tilbake til utøver profil
        </button>
      </>
    )
  }
}
