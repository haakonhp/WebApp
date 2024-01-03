import type {NextRequest, NextResponse} from "next/server";
import {resolveCreateUser, resolveGetAllUsers} from "@/features/Atheletes/user.controller";

export async function GET(request: NextRequest): Promise<NextResponse> {
    return await resolveGetAllUsers(request)
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    return await resolveCreateUser(request)
}