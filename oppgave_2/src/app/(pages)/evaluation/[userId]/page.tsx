import Evaluation from "@/components/evaluation/Evaluation"

export default function Page({ params }: { params: { userId: string } }) {
  const userId = params.userId
  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-screen-md flex-col p-4 md:max-w-screen-lg md:p-8">
        <Evaluation userId={userId} />
      </main>
    </>
  )
}
