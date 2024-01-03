import {NextRequest, NextResponse} from "next/server";
import {resolveCreateTournament} from "@/features/Tournaments/tournament.controller";

export async function POST(request: NextRequest): Promise<NextResponse> {
    return await resolveCreateTournament(request)
}