export type Task = {
  id: string
  text: string
  type: "pluss" | "delt på" | "gange" | "minus"
  data: `${number}|${number}`
  solution: number
}

export type Answer = {
  id: string
  userId: string
  attempts: number
  taskId: string | null
}

export type feedbackSummary = {
  successfulTasks: number,
  mostDifficultOperation:  string,
  mostDifficultOperationErrors: number
}


export type feedBackDatabaseResponse = {
 typeResponse:  {task: { type: string; } | null; }[]
 sumCorrect: number
}

export type databaseCountByType = {
  PLUSS: number,
  MINUS: number,
  DELE: number,
  GANGE: number
}

export type reducerSumCategories = Record<string, number>

export enum errorCodes {
  GENERIC_ERROR,
  DUPLICATE_DATABASE_ENTRY,
  USER_NOT_ALLOWED_TO_MODIFY
}

export type baseResult<T> = {
  success: boolean,
  data: T | null,
  error?: string
  errorCode?: errorCodes
}

export type databaseResult<T> = baseResult<T>

export type serviceResult<T> = baseResult<T>

export type answerInsert = {
  userId: string,
  taskId: string,
  answer: number,
}


export type answerResponse = {
  id: string
  attempts: number,
  task?: { solution: number } | null
  correct?: boolean,
}

export type answerResponseInternal = answerResponse & {
  succeeded: boolean
}

export type Type = "pluss" | "delt på" | "gange" | "minus"
