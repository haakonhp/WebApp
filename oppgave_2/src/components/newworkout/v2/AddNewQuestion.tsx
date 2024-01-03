"use client"

import type { Question } from "@/types/question"

import NewQuestions from "@/components/newquestions/NewQuestions"
import QuestionTable from "./QuestionTable"

const AddNewQuestion = ({
  newQuestion,
  setNewQuestion,
}: {
  newQuestion: Question[]
  setNewQuestion: React.Dispatch<React.SetStateAction<Question[]>>
}) => {
  const addQuestion = (newQuestion: Question) => {
    setNewQuestion((prevQuestions) => [...prevQuestions, newQuestion])
  }

  return (
    <>
      <NewQuestions addQuestion={addQuestion} />
      <QuestionTable questions={newQuestion} />
    </>
  )
}

export default AddNewQuestion
