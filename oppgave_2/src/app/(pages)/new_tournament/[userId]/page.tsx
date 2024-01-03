"use client"

import NewTournament from "@/components/newtournament/NewTournament"
import React from "react"
import AthleteCard from "@/components/athlete/athleteData/AthleteCard";

export default function Page ({ params }: { params: { userId: string } }) {
    const userId = params.userId
    return (
        <>
            <main className="mx-auto flex min-h-screen max-w-screen-sm flex-col p-4 sm:max-w-screen-lg sm:p-8">

                <h1 className="mb-6 text-4xl font-extrabold dark:text-white">
                    Opprette ny konkurranse
                </h1>
                <AthleteCard userId={userId} isEditable={false} />
                <NewTournament params={{ userId }} />
            </main>
        </>
    )
};