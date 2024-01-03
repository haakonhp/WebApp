import { type NextRequest, NextResponse } from "next/server"

import {
  handleCreateGoal,
  handleGetAllGoalsFromUserId,
} from "@/features/Goals/goals.service"
import { produceNextResponseError } from "@/features/HelperFeatures/serviceFunctions/controllerErrorSwitch"
import { extractJSONData } from "@/features/HelperFeatures/serviceFunctions/JSONDataExtraction"
import type { Goal } from "@/types/baseTypes";
import type { resourceRequestById } from "@/types/contextTypes";

export const resolveCreateGoal = async (
  request: NextRequest,
): Promise<NextResponse> => {
  if (request.headers.get("content-type") !== "application/json") {
    return NextResponse.json(
      { success: false, data: { error: "Invalid request format, use JSON." } },
      { status: 415 },
    )
  }

  const createGoalRequest = await extractJSONData<Goal>(request)
  if (!createGoalRequest) {
    return NextResponse.json(
      { success: false, data: { error: "JSON Parsing error." } },
      { status: 500 },
    )
  }

  if (
    !createGoalRequest.userId ||
    !createGoalRequest.goal ||
    !createGoalRequest.name ||
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    !createGoalRequest.date
  ) {
    return NextResponse.json(
      {
        success: false,
        data: { error: "Missing proper attributes for Goal." },
      },
      { status: 400 },
    )
  }

  const createGoalResponse = await handleCreateGoal(createGoalRequest)

  if (createGoalResponse.error) {
    return produceNextResponseError(createGoalResponse.error, createGoalResponse.dbCause)
  }

  return NextResponse.json(
    { success: true, data: createGoalResponse },
    { status: 200 },
  )
}

export const resolveGetUserGoals = async (request: NextRequest, context: resourceRequestById): Promise<NextResponse> => {
  const goals = await handleGetAllGoalsFromUserId(context.params.id)

  if (goals.error) {
    return produceNextResponseError(goals.error, goals.dbCause)
  }

  return NextResponse.json({ success: true, data: goals }, { status: 200 })
}
