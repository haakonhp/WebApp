import {type NextRequest, NextResponse} from "next/server"

import {produceNextResponseError} from "@/features/HelperFeatures/serviceFunctions/controllerErrorSwitch"
import {extractJSONData} from "@/features/HelperFeatures/serviceFunctions/JSONDataExtraction"
import {
    handleCreateTournament,
    handleGetAllTournamentsFromUserId,
} from "@/features/Tournaments/tournament.service"
import type {resourceRequestById} from "@/types/contextTypes";
import type {Tournament} from "@/types/tournament";

export const resolveCreateTournament = async (
    request: NextRequest,
): Promise<NextResponse> => {
    if (request.headers.get("content-type") !== "application/json") {
        return NextResponse.json(
            {success: false, data: {error: "Invalid request format, use JSON."}},
            {status: 415},
        )
    }

    const createTournamentRequest = await extractJSONData<Tournament>(request)
    if (!createTournamentRequest) {
        return NextResponse.json(
            {success: false, data: {error: "JSON Parsing error."}},
            {status: 500},
        )
    }

    const hasBaseValues = createTournamentRequest.userId && createTournamentRequest.name && createTournamentRequest.location &&
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        createTournamentRequest.date && createTournamentRequest.goal && createTournamentRequest.description && createTournamentRequest.priority
        && createTournamentRequest.sport

    if (!hasBaseValues) {
        return NextResponse.json(
            {
                success: false,
                data: {error: "Missing proper attributes for Tournament."},
            },
            {status: 400},
        )
    }

    const tournamentDatabaseResponse = await handleCreateTournament(
        createTournamentRequest,
    )

    if (tournamentDatabaseResponse.error) {
        return produceNextResponseError(tournamentDatabaseResponse.error, tournamentDatabaseResponse.dbCause)
    }

    return NextResponse.json(
        {success: true, data: tournamentDatabaseResponse},
        {status: 200},
    )
}

export const resolveGetUserTournaments = async (
    request: NextRequest,
    context: resourceRequestById,
): Promise<NextResponse> => {
    const tournaments = await handleGetAllTournamentsFromUserId(context.params.id)

    if (tournaments.error) {
        return produceNextResponseError(tournaments.error, tournaments.dbCause)
    }

    return NextResponse.json(
        {success: true, data: tournaments},
        {status: 200},
    )
}
