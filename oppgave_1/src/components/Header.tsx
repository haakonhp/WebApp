import { useTaskContext } from "@/features/TaskContext"

export default function Header() {
  const { count, tasks } = useTaskContext()
  const TaskLength = tasks.length

  return (
    <h1>
      Oppgave {count + 1} av {TaskLength}
    </h1>
  )
}
