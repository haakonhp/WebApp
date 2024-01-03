"use client"

// Import packages
import React, { type Dispatch, type SetStateAction, useEffect, useState } from "react"
// Import types
import format from "date-fns/format"
import { nb } from "date-fns/locale"
import { useRouter } from "next/navigation"

import DarkAlert from "@/components/shared/AlertCard"
// Import cards
import Card from "../../shared/Card"
import Loading from "../../shared/Loading"
import IntensityzonesCard from "../IntensityzonesCard"
import PerformanceEditCard from "./PerformanceEditCard"
import PerformanceHistoryCard from "./PerformanceHistoryCard"
import type {UserMetaFrontEnd} from "@/types/user";

const PerformanceCard = ({ userId }: { userId: string }) => {
  const [toggleEdit, setToggleEdit] = useState<boolean>(false)
  const [toggleHistory, setToggleHistory] = useState<boolean>(false)

  if (!toggleEdit) {
    return (
      <>
        <Card title="Utøver prestasjon" icon={PerformanceIcon}>
          <PerformanceInfo
            userId={userId}
            setToggleEdit={setToggleEdit}
            setToggleHistory={setToggleHistory}
            toggleHistory={toggleHistory}
          />
        </Card>

        {toggleHistory && (
          <Card title="Prestasjons historikk" icon={HistoryIcon}>
            <PerformanceHistoryCard userId={userId} />
          </Card>
        )}

        {/*Rendrer IntensityZonesCard hver gang PerformanceInfo blir renderet, slik at Intensity blir også oppdatert ved endring*/}
        <IntensityzonesCard userId={userId} />
      </>
    )
  } else
    return (
      <Card title="Ny utøver prestasjon" icon={EditIcon}>
        <PerformanceEditCard userId={userId} setToggleEdit={setToggleEdit} />
      </Card>
    )
}

const PerformanceIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      className="mr-6"
    >
      <g fill="none">
        <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
        <path
          fill="currentColor"
          d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14Zm0 2H5v14h14V5Zm-6.963 2.729c.271-.868 1.44-.95 1.85-.184l.052.11L15.677 12H17a1 1 0 0 1 .117 1.993L17 14h-1.993a1.01 1.01 0 0 1-.886-.524l-.052-.11l-.953-2.384l-1.654 5.293c-.259.828-1.355.953-1.807.255l-.06-.105L8.381 14H7a1 1 0 0 1-.117-1.993L7 12h1.994c.34 0 .654.17.84.449l.063.11l.388.776l1.752-5.606Z"
        />
      </g>
    </svg>
  )
}

const HistoryIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      className="mr-6"
    >
      <path
        fill="currentColor"
        d="M12 21q-3.45 0-6.012-2.287T3.05 13H5.1q.35 2.6 2.313 4.3T12 19q2.925 0 4.963-2.037T19 12q0-2.925-2.037-4.962T12 5q-1.725 0-3.225.8T6.25 8H9v2H3V4h2v2.35q1.275-1.6 3.113-2.475T12 3q1.875 0 3.513.713t2.85 1.924q1.212 1.213 1.925 2.85T21 12q0 1.875-.712 3.513t-1.925 2.85q-1.213 1.212-2.85 1.925T12 21m2.8-4.8L11 12.4V7h2v4.6l3.2 3.2z"
      />
    </svg>
  )
}

const EditIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      className="mr-6"
    >
      <g fill="none">
        <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092" />
        <path
          fill="currentColor"
          d="M13 3a1 1 0 0 1 .117 1.993L13 5H5v14h14v-8a1 1 0 0 1 1.993-.117L21 11v8a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19V5a2 2 0 0 1 1.85-1.995L5 3zm6.243.343a1 1 0 0 1 1.497 1.32l-.083.095l-9.9 9.899a1 1 0 0 1-1.497-1.32l.083-.094l9.9-9.9"
        />
      </g>
    </svg>
  )
}

const PerformanceInfo = ({
  userId,
  toggleHistory,
  setToggleEdit,
  setToggleHistory,
}: {
  userId: string
  toggleHistory: boolean
  setToggleEdit: Dispatch<SetStateAction<boolean>>
  setToggleHistory: Dispatch<SetStateAction<boolean>>
}) => {
  const [performanceData, setPerformanceData] = useState<
    UserMetaFrontEnd | undefined | null
  >(undefined)
  const router = useRouter()

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await fetch(`/api/athletes/${userId}`, {
          method: "get",
        })

        const result = (await response.json()) as {
          data: { data: UserMetaFrontEnd }
        }
        setPerformanceData(result.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    void fetchPerformanceData()
  }, [userId])

  if (performanceData === undefined) {
    return <Loading />
  }
  if (performanceData?.metaHistory.length === 0 || performanceData === null) {
    return (
      <>
        <DarkAlert
          title="Mangler data!"
          description="Ta en ny prestasjonstest"
        />
        <button
          type="button"
          onClick={() => {
            setToggleEdit(true)
          }}
          className="mb-2 me-2 mt-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Endre
        </button>
      </>
    )
  } else {
    return (
      <>
        <div className="grid grid-cols-3 gap-4">
          <div className="... col-span-2">
            <p>
              Sist målt:{" "}
              {format(
                new Date(performanceData.metaHistory[0].creation_time!),
                "dd.MM.yyyy",
                {
                  locale: nb,
                },
              )}
            </p>
            <p>
              Maksimal hjertefrekvens:{" "}
              {performanceData.metaHistory[0].heartrate}
            </p>
            <p>Terskelwatt: {performanceData.metaHistory[0].watt}</p>
            <p>Terskelfart: {performanceData.metaHistory[0].speed}</p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setToggleEdit(true)
              }}
              className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Endre
            </button>
            <button
              type="button"
              onClick={() => {
                setToggleHistory(!toggleHistory)
              }}
              className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Historikk
            </button>
          </div>
        </div>
      </>
    )
  }
}

export default PerformanceCard
