import { useEffect, useState } from "react"
import { toast } from "react-toastify"

import Card from "@/components/shared/Card"
import Loading from "@/components/shared/Loading"
import { GoalsAndTournamentsIcon } from "./GoalsAndTournamentsCard"
import type {Goal} from "@/types/baseTypes";

const UserGoalsCard = ({ userId }: { userId: string }) => {
  return (
    <Card title="Personlige mål" icon={GoalsAndTournamentsIcon}>
      <UserGoalsInfo userId={userId} />
    </Card>
  )
}

const UserGoalsInfo = ({ userId }: { userId: string }) => {
  const [userGoals, setUserGoals] = useState<Goal[] | undefined | null>(
    undefined,
  )

  useEffect(() => {
    const fetchUserGoals = async () => {
      try {
        const response = await fetch(`/api/athletes/${userId}/goals`, {
          method: "get",
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`)
        }

        const result = (await response.json()) as {
          data: { data: Goal[] | null }
        }
        setUserGoals(result.data.data)
      } catch (error) {
        toast.error("Error fetching data")
      }
    }
    void fetchUserGoals()
  }, [userId])

  if (userGoals === undefined) {
    return <Loading />
  } else if (userGoals === null) {
    return <p>Ingen personlige mål funnet</p>
  } else {
    return (
      <div>
        {userGoals.map((item) => (
          <p key={item.id}>{item.name}</p>
        ))}
      </div>
    )
  }
}

export default UserGoalsCard
