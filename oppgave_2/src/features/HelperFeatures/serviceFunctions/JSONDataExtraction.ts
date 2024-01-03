import {NextRequest} from "next/server";

export async function extractJSONData<T>(request: NextRequest): Promise<T | null> {
    try {
        return await request.json() as T;
    } catch (e) {
        return null
    }
}