"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { toast } from "react-toastify"

const AthleteEditCard = ({
  userId,
  setToggleEdit,
}: {
  userId: string
  setToggleEdit: Dispatch<SetStateAction<boolean>>
}) => {
  const [gender, setGender] = useState<string | undefined>(undefined)
  const [sport, setSport] = useState<string | undefined>(undefined)

  const updateUserDetails = async () => {
    const payload = {
      userId: userId,
      gender,
      sport,
    }

    try {
      toast.loading("Lagrer data...")
      const response = await fetch(`/api/athletes/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        toast.dismiss()
        toast.error("Noe gikk galt. Kunne ikke lagre data")
      } else {
        toast.dismiss()
        toast.success("Utøver data er endret")
        setToggleEdit(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <label
        htmlFor="gender"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        Kjønn:
      </label>
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

      <SelectSport sport={sport} setSport={setSport} />

      <button
        type="button"
        onClick={() => {
          setToggleEdit(false)
        }}
        className="mb-2 me-2 mt-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Tilbake
      </button>
      <button
        type="button"
        onClick={() => updateUserDetails()}
        className="mb-2 me-2 mt-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Lagre
      </button>
    </>
  )
}

export const SelectSport = ({
  sport,
  setSport,
}: {
  sport: string | undefined
  setSport: Dispatch<SetStateAction<string | undefined>>
}) => {
  const [sports, setSports] = useState<string[]>([])

  useEffect(() => {
    const fetchAvailableSports = async () => {
      try {
        const response = await fetch(`/api/sports/`, {
          method: "get",
        })

        const result = (await response.json()) as { data: { data: string[] } }
        setSports(result.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    void fetchAvailableSports()
  }, [])

  return (
    <>
      <label
        htmlFor="sports"
        className="text-1xl mb-2 block font-extrabold text-gray-900 dark:text-white"
      >
        Sport:
      </label>
      <select
        id="sports"
        value={sport}
        onChange={(e) => {
          setSport(e.target.value)
        }}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      >
        <option selected>Velg sport</option>
        {sports.map((item) => (
          <>
            <option value={item}>{item}</option>
          </>
        ))}
      </select>
    </>
  )
}
export default AthleteEditCard
