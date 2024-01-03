import type {NextRequest, NextResponse} from "next/server";
import {resolveDeleteUser, resolveGetUserById, resolveUpdateUser} from "@/features/Atheletes/user.controller";

import type {resourceRequestById} from "@/types/contextTypes";

export async function GET(request: NextRequest,  context: resourceRequestById): Promise<NextResponse> {
    return await resolveGetUserById(request, context)
}

export async function DELETE(request: NextRequest,  context: resourceRequestById): Promise<NextResponse> {
    return await resolveDeleteUser(request, context)
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
    return await resolveUpdateUser(request)
}

