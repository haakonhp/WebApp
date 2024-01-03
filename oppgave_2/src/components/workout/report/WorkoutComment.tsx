import React from "react"
import type { ActivityResponse } from "@/types/activity"

const WorkoutComment = ({
  comment,
  setComment,
  workoutData,
}: {
  comment: string
  workoutData: ActivityResponse | undefined
  setComment: React.Dispatch<React.SetStateAction<string>>
}) => {
  return (
    <>
      <label
        htmlFor="message"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        Kommentar til økten
      </label>
      <textarea
        id="message"
        rows={4}
        value={comment}
        onChange={(e) => {
          setComment(e.currentTarget.value)
        }}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder="Skriv din kommentar her..."
      ></textarea>
    </>
  )
}

export default WorkoutComment
