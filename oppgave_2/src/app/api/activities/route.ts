import type {NextRequest, NextResponse} from "next/server";
import {resolveCreateActivity, resolveGetAllActivities} from "@/features/Activities/activities.controller";

export async function POST(request: NextRequest): Promise<NextResponse> {
    return await resolveCreateActivity(request)
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    return await resolveGetAllActivities(request)
}