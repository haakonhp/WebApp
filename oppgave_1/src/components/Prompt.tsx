"use client"

import { type FormEvent, type MouseEvent, useState } from "react"

import { useTaskContext } from "@/features/TaskContext"
import { type Task as TaskType } from "@/types"

export default function Prompt() {
  const { setTasks } = useTaskContext()

  const [prompt, setPrompt] = useState<number>(0)
  const [error, setError] = useState<string>("")

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/restapi/?count=${prompt}`, {
        method: "get",
      })
      const result = (await response.json()) as { data: TaskType[] }
      setTasks(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const send = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setError("")
    if (prompt === 0 || prompt > 10) {
      setError("Du må velge et antall mellom 1-10")
      return
    }

    await fetchQuestions()
  }

  const update = (event: FormEvent<HTMLInputElement>) => {
    setPrompt(event.currentTarget.valueAsNumber)
  }

  return (
    <div className="flex flex-col">
      <label htmlFor="query">Hvor mange matte spørsmål vil du ha?</label>
      <input name="query" type="number" placeholder="1-10" onInput={update} />
      {error != "" && <p className="text-red-500">{error}</p>}
      <div className="mb-6"></div>
      <button className="bg-blue-500" onClick={send}>
        Send
      </button>
    </div>
  )
}
