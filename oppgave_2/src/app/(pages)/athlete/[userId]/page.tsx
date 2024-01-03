"use client"

import AthleteCard from "@/components/athlete/athleteData/AthleteCard"
import GoalsAndTournamentsCard from "@/components/athlete/goalsAndTournaments/GoalsAndTournamentsCard"
import PerformanceCard from "@/components/athlete/performanceData/PerformanceCard"
import UserWorkouts from "@/components/athlete/UserWorkouts"

export default function Page({ params }: { params: { userId: string } }) {
  const userId = params.userId

  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-screen-md flex-col p-4 md:max-w-screen-lg md:p-8">
        <DashboardCards userId={userId} />
      </main>
    </>
  )
}

const DashboardCards = ({ userId }: { userId: string }) => {
  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col  gap-4">
          <AthleteCard userId={userId} isEditable={true} />
          <GoalsAndTournamentsCard userId={userId} />
          <PerformanceCard userId={userId} />
          <UserWorkouts userId={userId} />
        </div>
      </div>
    </>
  )
}
