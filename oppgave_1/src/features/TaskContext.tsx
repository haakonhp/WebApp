"use client"

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from "react"

import useProgress from "@/hooks/useProgress"
import { type Task as TaskType } from "@/types"

type TaskData = {
  userId: number
  setUserId: Dispatch<SetStateAction<number>>
  tasks: TaskType[]
  prompt: number
  setPrompt: Dispatch<SetStateAction<number>>
  setTasks: Dispatch<SetStateAction<TaskType[]>>
  taskDone: boolean
  setTaskDone: Dispatch<SetStateAction<boolean>>
  count: number
  setCount: Dispatch<SetStateAction<number>>
  current: TaskType
  next: () => void
  prev: () => void
  fetchQuestions: () => Promise<void>
}
const TaskContext = createContext<TaskData | undefined>(undefined)

export const TaskProvider = (props: { children: ReactNode }) => {
  const { children } = props

  const [userId, setUserId] = useState(Math.floor(Math.random() * 100000))

  // Starter først med å sette randomized tasks i en array
  const [prompt, setPrompt] = useState<number>(0)

  const [tasks, setTasks] = useState<TaskType[]>([])
  const { count, setCount, current, next, prev } = useProgress({ tasks })
  const [taskDone, setTaskDone] = useState<boolean>(false)

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

  const contextValue: TaskData = {
    prompt,
    setPrompt,
    userId,
    setUserId,
    tasks,
    setTasks,
    taskDone,
    setTaskDone,
    count,
    setCount,
    current,
    next,
    prev,
    fetchQuestions,
  }

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  )
}

export const useTaskContext = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("TaskContext needs a TaskProvider")
  }
  return context
}
