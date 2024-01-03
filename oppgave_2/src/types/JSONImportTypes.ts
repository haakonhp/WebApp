import type {QuestionVariant, Sport} from "@/types/stringVariants";

import type {Meta} from "@/types/user";

export type userData = {
    id: string
    userId: string
    gender: string
    sport: Sport
    meta: Meta
    activities: {
        date: Date
        goalId: string
        name: string
        slug: string
        sport: string
        tags: string[]
        questions: {
            id: string
            question: string
            type: QuestionVariant
        }[]
        intervals: {
            id: string
            duration: number
            intensity: number
        }[]

    }[]
}
export type importedUserData = userData[]