import AthleteCard from "@/components/athlete/athleteData/AthleteCard"
import NewWorkout from "@/components/newworkout/v2/NewWorkout"

export default function Page({ params }: { params: { userId: string } }) {
  const userId = params.userId
  return (
    <main className="mx-auto flex min-h-screen max-w-screen-md flex-col p-4 md:max-w-screen-lg md:p-8">
      <h1 className="mb-6 text-4xl font-extrabold dark:text-white">
        Opprette Ny Økt
      </h1>
      <AthleteCard userId={userId} isEditable={false} />
      <NewWorkout userId={userId} />
    </main>
  )
}
