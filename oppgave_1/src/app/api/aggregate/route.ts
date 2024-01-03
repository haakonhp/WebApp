import {NextRequest} from "next/server";
import {handleFeedbackRequest} from "@/features/questions/tasks.controller";

export async function GET(request: NextRequest) {
    // return await returnAllTasks(request);
    return await handleFeedbackRequest(request);
}

