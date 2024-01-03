import { useRouter } from "next/navigation"

import { useTaskContext } from "@/features/TaskContext"

export default function Progress() {
  const { prev, next, taskDone, count, tasks } = useTaskContext()
  const TaskLength = tasks.length

  const router = useRouter()

  return (
    <footer className="mt-4 border-t-slate-300">
      {count > 0 && (
        <button onClick={prev} className="bg-purple-700 text-white">
          Forrige
        </button>
      )}
      {taskDone && TaskLength > count + 1 && (
        <button onClick={next} className="bg-teal-700 text-white">
          Vis neste oppgave
        </button>
      )}

      {taskDone && TaskLength === count + 1 && (
        <button
          onClick={() => router.push(`/resultater`)}
          className="bg-teal-700 text-white"
        >
          Vis resultater
        </button>
      )}
    </footer>
  )
}
