import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import type { Tournament } from "@/types/tournament"

import AlertCard from "@/components/shared/AlertCard"
import Loading from "@/components/shared/Loading"

const UserTournamentsDropDown = ({
  setTournamentId,
  userId,
}: {
  setTournamentId: React.Dispatch<React.SetStateAction<string | null>>
  userId: string
}) => {
  const [tournaments, setTournaments] = useState<Tournament[] | null>(null)

  useEffect(() => {
    void fetchTournaments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const fetchTournaments = async () => {
    try {
      const response = await fetch(`/api/athletes/${userId}/tournaments`, {
        method: "get",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = (await response.json()) as {
        data: { data: Tournament[] | null }
      }
      setTournaments(result.data.data)
    } catch (error) {
      console.error("API error tournaments:", error)
    }
  }

  if (tournaments === null) {
    return (
      <AlertCard title="Ingen turneringer funnet" description="Legg til nye" />
    )
  } else {
    return (
      <>
        <h2 className="mb-6 text-xl font-extrabold dark:text-white">
          Personlige turneringer
        </h2>
        <div className="flex flex-row justify-start">
          <select
            id="countries"
            className="mb-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            onChange={(event) => {
              const selectedValue = event.target.value
              setTournamentId(selectedValue === "null" ? null : selectedValue)
            }}
          >
            <option value="null">Ingen</option>
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.name}
              </option>
            ))}
          </select>
        </div>
      </>
    )
  }
}

export default UserTournamentsDropDown
