import type {NextRequest, NextResponse} from "next/server";
import {resolveGetAllSports} from "@/features/Sports/sports.controller";
export async function GET(request: NextRequest): Promise<NextResponse> {
    return await resolveGetAllSports()
}