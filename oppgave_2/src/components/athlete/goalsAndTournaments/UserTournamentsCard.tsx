"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"

import Card from "@/components/shared/Card"
import Loading from "@/components/shared/Loading"
import { GoalsAndTournamentsIcon } from "./GoalsAndTournamentsCard"
import type {Tournament} from "@/types/tournament";

const UserTournamentsCard = ({ userId }: { userId: string }) => {
  return (
    <Card title="Personlige turneringer" icon={GoalsAndTournamentsIcon}>
      <UserTournamentsInfo userId={userId} />
    </Card>
  )
}

const UserTournamentsInfo = ({ userId }: { userId: string }) => {
  const [userTournaments, setUserTournaments] = useState<
    Tournament[] | undefined | null
  >(undefined)

  useEffect(() => {
    const fetchUserTournaments = async () => {
      try {
        const response = await fetch(`/api/athletes/${userId}/tournaments`, {
          method: "get",
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`)
        }

        const result = (await response.json()) as {
          data: { data: Tournament[] | null }
        }
        setUserTournaments(result.data.data)
      } catch (error) {
        toast.error("Error fetching data")
      }
    }
    void fetchUserTournaments()
  }, [userId])

  if (userTournaments === undefined) {
    return <Loading />
  } else if (userTournaments === null) {
    return <p>Ingen turneringer funnet</p>
  } else {
    return (
      <div>
        {userTournaments.map((item) => (
          <p key={item.id}>{item.name}</p>
        ))}
      </div>
    )
  }
}

export default UserTournamentsCard
