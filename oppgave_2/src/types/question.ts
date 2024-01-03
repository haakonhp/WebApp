import type { QuestionVariant } from "@/types/stringVariants"

export type Question = {
  id?: string
  question: string
  type: QuestionVariant
}

export type QuestionUserAdded = {
  templateQuestionId: string
  question: string
  type: QuestionVariant
}

export type QuestionInsert = Omit<Question, "id"> & {
  connectedActivity: string
}
export type QuestionUpdate = {
  id: string
  answer: string
}
