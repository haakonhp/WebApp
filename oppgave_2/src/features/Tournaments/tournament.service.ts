import { produceFriendlyError } from "@/features/HelperFeatures/serviceFunctions/serviceErrorSwitch"
import {
  createSingleTournament,
  getTournamentsByUserId,
} from "@/features/Tournaments/tournament.repository"
import type {Tournament} from "@/types/tournament";
import type {serviceResult} from "@/types/DatatransferTypes";

export const handleCreateTournament = async (
  tournament: Tournament,
): Promise<serviceResult<Tournament>> => {
  const returnedQuestionResponse = await createSingleTournament(tournament)

  if (returnedQuestionResponse.error) {
    return produceFriendlyError<Tournament>(
      returnedQuestionResponse.error,
      "Tournament", returnedQuestionResponse.dbCause
    )
  }

  return { success: true, data: returnedQuestionResponse.data }
}

export const handleGetAllTournamentsFromUserId = async (
  userId: string,
): Promise<serviceResult<Tournament[]>> => {
  const tournaments = await getTournamentsByUserId(userId)
  if (tournaments.error) {
    return produceFriendlyError<Tournament[]>(tournaments.error, "Tournament", tournaments.dbCause)
  }

  return { success: true, data: tournaments.data }
}
