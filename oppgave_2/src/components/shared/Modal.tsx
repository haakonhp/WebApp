"use client"

import React, { useEffect, useState } from "react"
import type { ActivityResponse } from "@/types/activity"
import { format } from "date-fns"
import nb from "date-fns/locale/nb"
import { useRouter } from "next/navigation"

export const Modal = () => {
  const [toggleModal, setToggleModal] = useState<boolean>(false)

  const [notifications, setNotifications] = useState<ActivityResponse[] | null>(
    null,
  )

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/tasks`, {
          method: "GET",
        })
        const result = (await response.json()) as {
          data: { data: ActivityResponse[] }
        }
        setNotifications(result.data.data)
      } catch (error) {
        console.log()
      }
    }
    void fetchNotifications()
  }, [])
  return (
    <>
      <button
        type="button"
        data-modal-target="popup-modal"
        data-modal-toggle="popup-modal"
        onClick={() => {
          setToggleModal(true)
        }}
        className="relative inline-flex items-center rounded-lg p-3 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
        >
          <path
            fill="white"
            d="M10 21h4c0 1.1-.9 2-2 2s-2-.9-2-2m11-2v1H3v-1l2-2v-6c0-3.1 2-5.8 5-6.7V4c0-1.1.9-2 2-2s2 .9 2 2v.3c3 .9 5 3.6 5 6.7v6l2 2m-4-8c0-2.8-2.2-5-5-5s-5 2.2-5 5v7h10v-7Z"
          />
        </svg>
        <span className="sr-only">Notifications</span>
        <div className="absolute -end-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white dark:border-gray-900">
          {notifications?.length}
        </div>
      </button>

      <span className="sr-only">Notifications</span>

      {toggleModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black opacity-50"></div>
          <div
            id="popup-modal"
            className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 md:inset-0`}
          >
            <div className="relative max-h-full w-full max-w-xl p-4">
              {" "}
              <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setToggleModal(false)
                  }}
                  className="absolute end-2.5 top-3 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="popup-modal"
                >
                  <svg
                    className="h-3 w-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-4 text-center md:p-5">
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Notifikasjoner
                  </h3>
                  <NotificationsTable
                    notifications={notifications}
                    setToggleModal={setToggleModal}
                  />
                  <button
                    data-modal-hide="popup-modal"
                    onClick={() => {
                      setToggleModal(false)
                    }}
                    type="button"
                    className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
                  >
                    Lukk
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

const NotificationsTable = ({
  notifications,
  setToggleModal,
}: {
  notifications: ActivityResponse[] | null
  setToggleModal: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const router = useRouter()

  if (notifications === null) {
    return null
  } else {
    return (
      <>
        <div className="relative mb-6 max-h-96 overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  #
                </th>
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Endre status
                </th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((item, index) => (
                <React.Fragment key={index}>
                  <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      {format(new Date(item.date!), "dd.MM.yyyy", {
                        locale: nb,
                      })}
                    </th>
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => {
                          router.push(`/status/${item.goalId}`)
                          setToggleModal(false)
                        }}
                        className="mb-2 me-2 mt-4 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Endre
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )
  }
}
