"use client"

import React from "react"
import { useRouter } from "next/navigation"

import NewTemplate from "@/components/newtemplate/NewTemplate"

export default function Page() {
  const router = useRouter()
  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-screen-sm flex-col p-4 sm:max-w-screen-lg sm:p-8">
        <h1 className="mb-4 text-4xl font-extrabold dark:text-white">
          Opprette ny treningsmal
        </h1>
        <hr className="my-4 h-px border-0 bg-gray-200 dark:bg-gray-700" />
        <NewTemplate />
        <button
          type="button"
          onClick={() => {
            router.push(`/`)
          }}
          className="mb-2 me-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          Tilbake til dashboard
        </button>
      </main>
    </>
  )
}
