"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { toast } from "react-toastify"

const PerformanceEditCard = ({
  userId,
  setToggleEdit,
}: {
  userId: string
  setToggleEdit: Dispatch<SetStateAction<boolean>>
}) => {
  const [heartrate, setHeartrate] = useState<number | undefined>(undefined)
  const [watt, setWatt] = useState<number | undefined>(undefined)
  const [speed, setSpeed] = useState<number | undefined>(undefined)

  const updateUserPerformance = async () => {
    const payload = {
      heartrate,
      watt,
      speed,
    }

    if (!heartrate && !watt && !speed) {
      toast.error("Mangler felter!")
      return
    }

    try {
      const response = await fetch(`/api/athletes/${userId}/metadata`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        toast.error("Noe gikk galt. Kunne ikke lagre data")
      } else {
        toast.success("Velykket lagring av ny utøver data")
        setToggleEdit(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <p>Endre</p>
      <label
        htmlFor="first_name"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        Maksimal hjertefrekvens
      </label>
      <input
        type="number"
        id="heartrate"
        onChange={(e) => {
          setHeartrate(parseInt(e.currentTarget.value))
        }}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        required
      />
      <label
        htmlFor="first_name"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        Terskelwatt
      </label>
      <input
        type="number"
        id="watt"
        onChange={(e) => {
          setWatt(parseInt(e.currentTarget.value))
        }}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        required
      />
      <label
        htmlFor="first_name"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        Terskelfart
      </label>
      <input
        type="number"
        id="speed"
        onChange={(e) => {
          setSpeed(parseInt(e.currentTarget.value))
        }}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        required
      />
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
        onClick={() => updateUserPerformance()}
        className="mb-2 me-2 mt-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Lagre
      </button>
    </>
  )
}

export default PerformanceEditCard
