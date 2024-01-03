"use client"

import Header from "./Header"
import Task from "./Task"
import TaskText from "./TaskText"

const Question = () => {
  return (
    <>
      <Header />
      <TaskText text={"Hva blir resultatet av regneoperasjonen?"} />
      <Task />
    </>
  )
}

export default Question
