"use client"

import Prompt from "@/components/Prompt"
import Question from "@/components/Question"
import { useTaskContext } from "@/features/TaskContext"

export default function Home() {
  const { tasks } = useTaskContext()
  return (
    <main className="flex min-h-screen flex-col items-center bg-white p-4 sm:p-8">
      {tasks.length === 0 && <Prompt />}
      {tasks.length > 0 && <Question />}
    </main>
  )
}
