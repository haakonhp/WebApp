"use client"

import { useEffect, useState } from "react"
import type { FormEvent, MouseEvent } from "react"

import { useTaskContext } from "@/features/TaskContext"
import Progress from "./Progress"

type AnswerResponseType = {
  data: {
    success: boolean
    data: {
      attempts: number
      correct: boolean
      task: { solution: number }
    }
  }
}

export default function Answer({ task_id }: { task_id: string }) {
  const { userId, setTaskDone } = useTaskContext()

  const [answer, setAnswer] = useState<number | undefined>(undefined)
  const [answerResponse, setAnswerResponse] = useState<
    AnswerResponseType | undefined
  >(undefined)

  useEffect(() => {
    setAnswerResponse(undefined)
    setTaskDone(false)
  }, [task_id])

  const handleSubmit = async () => {
    let reqMethod = "POST"
    if (answerResponse) {
      reqMethod = "PUT"
    }

    try {
      const request = {
        method: reqMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          taskId: task_id,
          answer: answer,
        }),
      }
      const response = await fetch("http://localhost:3000/api/restapi", request)
      const responseData = (await response.json()) as AnswerResponseType
      setAnswerResponse(responseData)
    } catch (error) {
      console.log(error)
    }
  }

  const send = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    await handleSubmit()
  }

  const update = (event: FormEvent<HTMLInputElement>) => {
    setAnswer(event.currentTarget.valueAsNumber)
  }

  useEffect(() => {
    console.log(answerResponse)
    if (
      answerResponse?.data?.data?.correct ||
      answerResponse?.data?.data?.task?.solution
    ) {
      setTaskDone(true)
    }
  }, [answerResponse])

  return (
    <div className="mt-6 flex flex-col">
      <p>{answerResponse?.data?.data?.attempts || 0} av 3 forsøk</p>
      <FalseResponse isIncorrect={answerResponse?.data?.data?.correct} />
      <hr className="mb-3" />
      <label htmlFor="answer">Svar</label>
      <input
        name="answer"
        type="number"
        placeholder="Sett svar her"
        onInput={update}
      />
      <div className="mb-6"></div>
      {!answerResponse?.data?.data?.task?.solution &&
        !answerResponse?.data?.data?.correct && (
          <button className="bg-blue-500" onClick={send}>
            Send
          </button>
        )}
      <div className="mb-6"></div>
      <CorrectResponse isCorrect={answerResponse?.data?.data?.correct} />
      <Solution isSolution={answerResponse?.data?.data?.task?.solution} />
    </div>
  )
}

const Solution = ({ isSolution }: { isSolution: number | undefined }) => {
  const [showSolution, setShowSolution] = useState(false)

  if (isSolution) {
    return (
      <>
        <button
          className="mb-6 bg-green-500"
          onClick={() => {
            setShowSolution(!showSolution)
          }}
        >
          Se svaret
        </button>
        {showSolution && (
          <div className="bg-blue">
            <p>Svaret er: {isSolution}</p>
            <Progress />
          </div>
        )}
      </>
    )
  } else {
    return null
  }
}

const CorrectResponse = ({ isCorrect }: { isCorrect: boolean | undefined }) => {
  if (isCorrect) {
    return (
      <>
        <div>
          <p>Bra jobbet!</p>
          <Progress />
        </div>
      </>
    )
  } else {
    return null
  }
}

const FalseResponse = ({
  isIncorrect,
}: {
  isIncorrect: boolean | undefined
}) => {
  if (isIncorrect !== undefined && isIncorrect === false) {
    return (
      <>
        <div>
          <p>Feil svar, prøv igjen</p>
        </div>
      </>
    )
  } else {
    return null
  }
}
