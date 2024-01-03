"use client"

import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

import { SelectSport } from "../athlete/athleteData/AthleteEditCard"

const NewAthlete = () => {
  const router = useRouter()
  const [userId, setUserId] = useState<string>("")
  const [gender, setGender] = useState<string | undefined>(undefined)
  const [sport, setSport] = useState<string | undefined>(undefined)
  //-------------- ADD new_athlete via API to database  --------- //
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload = {
      userId: userId.split(" ").join("-"),
      gender,
      sport,
    }
    try {
      const response = await fetch("/api/athletes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        if (response.status === 409) {
          toast.error("Bruker med samme navn Eksisterer fra før av!")
        } else {
          throw new Error(`HTTP error: ${response.status}`)
        }
      } else {
        toast.success("Utøver lagt til!")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Noe gikk galt. Kunne ikke lagre data")
    }
  }
  /// ------------------------------------------------ //

  return (
    <>
      {/*Fikset design -håkon*/}
      <form onSubmit={handleSubmit} className="flex flex-col justify-between">
        <label
          htmlFor="userId"
          className="text-1xl mb-2 block font-extrabold text-gray-900 dark:text-white"
        >
          Navn:
          <input
            type="text"
            id="userId"
            name="userId"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value)
            }}
            placeholder="Skriv utøvers navn"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
        </label>
        <label
          htmlFor="gender"
          className="text-1xl mb-2 block font-extrabold text-gray-900 dark:text-white"
        >
          Velg kjønn:
          <select
            id="genders"
            value={gender}
            onChange={(e) => {
              setGender(e.target.value)
            }}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          >
            <option selected>Velg kjønn</option>
            <option value="male">Mann</option>
            <option value="woman">Kvinne</option>
            <option value="other">Annet</option>
          </select>
        </label>
        <SelectSport sport={sport} setSport={setSport} />
        <div className="flex flex-col justify-start">
          <button
            type="submit"
            className="mb-2 me-2 mt-4 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Legg til utøver
          </button>
          <button
            type="button"
            onClick={() => {
              router.push(`/`)
            }}
            className="mb-2 me-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >
            Tilbake til Dashboard
          </button>
        </div>
      </form>
    </>
  )
}

export default NewAthlete
