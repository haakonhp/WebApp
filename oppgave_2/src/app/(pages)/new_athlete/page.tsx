import React from "react"
import NewAthlete from "@/components/newathlete/NewAthlete";

export default function Page () {
    return (
        <>
            {/*Fikset design - Håkon*/}
            <main className="mx-auto flex min-h-screen max-w-screen-sm flex-col p-4 sm:max-w-screen-lg sm:p-8">
                <h1 className="mb-4 text-4xl font-extrabold dark:text-white">
                    Registrer ny utøver
                </h1>
                <hr className="my-4 h-px border-0 bg-gray-200 dark:bg-gray-700" />
                < NewAthlete />
            </main>
        </>
    )
};