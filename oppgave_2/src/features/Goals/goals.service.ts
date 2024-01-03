import {
  createSingleGoal,
  getGoalsByUserId,
} from "@/features/Goals/goals.repository"
import { produceFriendlyError } from "@/features/HelperFeatures/serviceFunctions/serviceErrorSwitch"
import type {Goal} from "@/types/baseTypes";
import type {serviceResult} from "@/types/DatatransferTypes";

export const handleCreateGoal = async (
  goal: Goal,
): Promise<serviceResult<Goal>> => {
  const returnedQuestionResponse = await createSingleGoal(goal)
  if (returnedQuestionResponse.error) {
    return produceFriendlyError<Goal>(returnedQuestionResponse.error, "Goal", returnedQuestionResponse.dbCause)
  }

  return { success: true, data: returnedQuestionResponse.data }
}

export const handleGetAllGoalsFromUserId = async (
  userId: string,
): Promise<serviceResult<Goal[]>> => {
  const goals = await getGoalsByUserId(userId)
  if (goals.error) {
    return produceFriendlyError<Goal[]>(goals.error, "Goal", goals.dbCause)
  }

  return { success: true, data: goals.data }
}
