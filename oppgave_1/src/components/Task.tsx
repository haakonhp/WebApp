import { useTaskContext } from "@/features/TaskContext"
import Answer from "./Answer"

export default function Task() {
  const { current } = useTaskContext()

  return (
    <>
      <article>
        <p>{current.type}</p>
        <h3>{current.text}</h3>
      </article>
      <Answer task_id={current.id} />
    </>
  )
};
