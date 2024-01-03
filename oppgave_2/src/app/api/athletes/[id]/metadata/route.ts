import type {NextRequest, NextResponse} from "next/server";
import {resolveCreateMetaDataForUser, resolveGetUserMetaById} from "@/features/Atheletes/user.controller";

import type {resourceRequestById} from "@/types/contextTypes";

export async function GET(request: NextRequest,  context: resourceRequestById): Promise<NextResponse> {
    return await resolveGetUserMetaById(request, context)
}

export async function POST(request: NextRequest, context: resourceRequestById): Promise<NextResponse> {
    return await resolveCreateMetaDataForUser(request, context);
}