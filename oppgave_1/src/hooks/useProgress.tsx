import { useState } from "react"

import { type Task as TaskType } from "@/types"

export default function useProgress({ tasks }: { tasks: TaskType[] }) {
  const [count, setCount] = useState<number>(0)
  const current = tasks[count]

  const next = () => {
    setCount((prevCount) =>
      prevCount < tasks.length - 1 ? prevCount + 1 : prevCount,
    )
  }
  const prev = () => {
    setCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0))
  }

  return { count, setCount, current, next, prev }
}
