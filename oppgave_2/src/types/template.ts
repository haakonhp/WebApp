import type { Interval } from "@/types/interval"
import type { Question } from "@/types/question"

export type checkBoxes = {
  intensityChecked?: boolean
  wattChecked?: boolean
  speedChecked?: boolean
  heartrateChecked?: boolean
}

export type TemplateInsert = {
  id: string
  name: string
  slug: string
  sport: string
  tagsStringable: string
  tags?: string[]
  questions?: Question[]
  UserActivityInterval?: Interval[]
} & checkBoxes
export type TemplateResponse = Omit<TemplateInsert, "tags">
export type templateQuestion = {
  templateQuestionId: string
  question: string
  type: string
}
export type templateQuestionLinkedInput = templateQuestion & {
  connectedTemplate: string
}

export type userTemplateListNode = {
  id: string
  name: string
  sport: string
}
