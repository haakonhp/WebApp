"use client"

import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import type { TemplateInsert } from "@/types/template"

import Loading from "@/components/shared/Loading"
import WorkoutDetails from "./WorkoutDetails"

const NewWorkoutByTemplate = ({ userId }: { userId: string }) => {
  const [templates, setTemplates] = useState<TemplateInsert[] | null>(null)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/templates/expanded", {
          method: "get",
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = (await response.json()) as {
          data: { data: TemplateInsert[] }
        }
        setTemplates(data.data.data)
      } catch (error) {
        toast.error(
          "Feil ved henting av Treningsmaler / Ingen Treningsmaler opprettet",
        )
        console.error("API error Fetching templates:", error)
      }
    }

    void fetchTemplates()
  }, [])

  // ------------ Dropdown Template logic ------------- //
  const [dropdownValue, setDropdownValue] = useState<TemplateInsert | null>(
    null,
  )

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTemplateId = e.target.value
    const selectedTemplate =
      templates?.find((template) => template.id === selectedTemplateId) ?? null
    setDropdownValue(selectedTemplate)
  }

  if (templates === null) {
    return <Loading />
  }

  if (templates.length === 0) {
    return <p>Ingen templates å velge i fra</p>
  }

  return (
    <>
      <h3 className="text-1xl mb-4 font-extrabold dark:text-white">
        Hent fra mal:
      </h3>
      {/*------ DROPDOWN Template -------*/}
      <select
        value={dropdownValue ? dropdownValue.id : ""}
        onChange={handleDropdownChange}
        className="w-400 mr-6 rounded-md border p-2 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-200"
      >
        <option value="">Velg mal</option>
        {templates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </select>

      {dropdownValue && (
        <WorkoutDetails userId={userId} template={dropdownValue} />
      )}
    </>
  )
}

export default NewWorkoutByTemplate
