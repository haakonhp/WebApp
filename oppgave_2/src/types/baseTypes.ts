export type Goal = {
  id: string
  name: string
  date: Date
  goal: number
  comment: string | null
  userId: string
}
export type Report = {
  id: string
  status: string
  connectedActivity: string
  createdAt: Date | null
  comment?: string | null
}

export type AllUserReports = Report & {
  UserActivity: {
    name: string
    goalId: string
  }
}
