import type {NextRequest} from "next/server";
import {requestDataOnCall} from "@/features/ImportHandling/import.controller";

export async function GET(request: NextRequest) {
    return await requestDataOnCall();
}

