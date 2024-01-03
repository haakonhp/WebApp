import React, { useEffect, useState } from "react"

import DarkAlert from "../shared/AlertCard"
import Card from "../shared/Card"
import Loading from "../shared/Loading"
import type {intensityZoneReport} from "@/types/user";

const IntensityzonesCard = ({ userId }: { userId: string }) => {
  return (
    <Card title="Intensitetssoner" icon={IntensityzonesIcon}>
      <IntensityzonesInfo userId={userId} />
    </Card>
  )
}

const IntensityzonesIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 512 512"
      className="mr-6"
    >
      <path
        fill="currentColor"
        d="M104 496H72a24 24 0 0 1-24-24V328a24 24 0 0 1 24-24h32a24 24 0 0 1 24 24v144a24 24 0 0 1-24 24Zm224 0h-32a24 24 0 0 1-24-24V232a24 24 0 0 1 24-24h32a24 24 0 0 1 24 24v240a24 24 0 0 1-24 24Zm112 0h-32a24 24 0 0 1-24-24V120a24 24 0 0 1 24-24h32a24 24 0 0 1 24 24v352a24 24 0 0 1-24 24Zm-224 0h-32a24 24 0 0 1-24-24V40a24 24 0 0 1 24-24h32a24 24 0 0 1 24 24v432a24 24 0 0 1-24 24Z"
      />
    </svg>
  )
}

const IntensityzonesInfo = ({ userId }: { userId: string }) => {
  const [intensityZoneReport, setIntensityZoneReport] = useState<
    intensityZoneReport | undefined | null
  >(undefined)

  const intensityWatt = intensityZoneReport?.watt
  // const intensityHeartRate = intensityZoneReport?.heartbeat
  const intensitySpeed = intensityZoneReport?.speed

  useEffect(() => {
    const fetchIntensityInfo = async () => {
      try {
        const response = await fetch(`/api/athletes/${userId}/intensityzones`, {
          method: "get",
        })

        const result = (await response.json()) as {
          data: { data: intensityZoneReport }
        }
        setIntensityZoneReport(result.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    void fetchIntensityInfo()
  }, [userId])

  if (intensityZoneReport === undefined) {
    return <Loading />
  }
  if (intensityZoneReport === null) {
    return (
      <p>
        <DarkAlert
          title="Prestasjon er ikke registrert!"
          description="Ta en ny prestasjonstest"
        />
      </p>
    )
  } else {
    return (
      <>
        <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Måling
              </th>
              <th scope="col" className="px-6 py-3">
                50%
              </th>
              <th scope="col" className="px-6 py-3">
                60%
              </th>
              <th scope="col" className="px-6 py-3">
                70%
              </th>
              <th scope="col" className="px-6 py-3">
                80%
              </th>
              <th scope="col" className="px-6 py-3">
                90%
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <td className="px-6 py-4">Puls</td>
              {intensityZoneReport.heartrate?.map((item, index) => (
                <td key={index} className="px-6 py-4">
                  {item}
                </td>
              ))}
            </tr>
            <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <td className="px-6 py-4">Watt</td>
              {intensityZoneReport.watt?.map((item, index) => (
                <td key={index} className="px-6 py-4">
                  {item}
                </td>
              ))}
            </tr>
            <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <td className="px-6 py-4">Hastighet</td>
              {intensityZoneReport.speed?.map((item, index) => (
                <td key={index} className="px-6 py-4">
                  {item}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </>
    )
  }
}

export default IntensityzonesCard
