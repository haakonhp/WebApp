import type {NextRequest, NextResponse} from "next/server";
import {
    resolveGetUserIntensityZones,
} from "@/features/Atheletes/user.controller";

import type {resourceRequestById} from "@/types/contextTypes";

export async function GET(request: NextRequest,  context: resourceRequestById): Promise<NextResponse> {
    return await resolveGetUserIntensityZones(request, context)
}
