import type {Sport} from "@/types/stringVariants";

export type User = {
    id: string
    userId: string
    gender: string
    sport: Sport
}
export type Meta = {
    heartrate: number
    watt: number
    speed: number
    creation_time: Date | null
}

export type MetaIdentifiable = Meta & { userId: string }
export type UserMeta = User & { meta: Meta }
export type UserMetaFrontEnd = User & { metaHistory: Meta[] }
export type UserPossiblyMeta = User & { meta?: Meta }

export type intensityZoneReport = {
    intensity?: number[]
    heartrate?: number[],
    watt?: number[],
    speed?: number[]
}