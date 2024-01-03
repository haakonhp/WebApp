import React, { useState } from "react"
import { toast } from "react-toastify"

import { ActivityResponse } from "@/types"
import Loading from "../shared/Loading"

const WorkoutGoalTournament = ({
  workoutData,
}: {
  workoutData: ActivityResponse
}) => {
  const goalId = workoutData.personalGoalId
  const tournamentId = workoutData.tournamentId
  if (goalId === undefined || tournamentId || undefined) {
    return <Loading />
  }
  if (goalId === null && tournamentId === null) {
    return <p>Fant ingen mål eller turneringer</p>
  } else {
    return (
      <>
        <UpdateWorkoutGoalTournament workoutData={workoutData} />
      </>
    )
  }
}

const UpdateWorkoutGoalTournament = ({
  workoutData,
}: {
  workoutData: ActivityResponse
}) => {
  const [chosenItem, setChosenItem] = useState()
  const patchWorkoutGoal = async () => {
    const payload = {
      personalGoalId: chosenItem,
    }

    const response = await fetch(`/api/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      toast.dismiss()
      toast.error("Noe gikk galt. Kunne ikke lagre data")
    } else {
      toast.dismiss()
      toast.success("Økt data er endret")
    }
  }
  return (
    <>
      <p>Hi</p>
    </>
  )
}

export default WorkoutGoalTournament
