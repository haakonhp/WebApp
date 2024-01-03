"use client"

import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import type { User } from "@/types/user"
import { useRouter } from "next/navigation"

import { AthleteIcon } from "@/components/shared/SharedIcons"
import { formatUserId } from "@/features/ReusableFunction/formatUserId"
import Card from "../../shared/Card"
import Loading from "../../shared/Loading"
import AthleteEditCard from "./AthleteEditCard"

const AthleteCard = ({
  userId,
  isEditable,
}: {
  userId: string
  isEditable: boolean
}) => {
  const [toggleEdit, setToggleEdit] = useState<boolean>(false)

  if (!toggleEdit) {
    return (
      <Card title="Utøver info" icon={AthleteIcon}>
        <AthleteInfo
          userId={userId}
          setToggleEdit={setToggleEdit}
          isEditable={isEditable}
        />
      </Card>
    )
  } else {
    return (
      <Card title="Endre utøver" icon={AthleteIcon}>
        <AthleteEditCard userId={userId} setToggleEdit={setToggleEdit} />
      </Card>
    )
  }
}

const AthleteInfo = ({
  userId,
  setToggleEdit,
  isEditable,
}: {
  userId: string
  isEditable: boolean
  setToggleEdit: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [userData, setUserData] = useState<User | undefined>(undefined)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/athletes/${userId}`, {
          method: "get",
        })

        const result = (await response.json()) as { data: { data: User } }
        setUserData(result.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    void fetchUserData()
  }, [userId])
  if (userData === undefined) {
    return <Loading />
  }
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="... col-span-2">
          <p>Navn: {formatUserId(userData.userId)}</p>
          <p>Kjønn: {userData.gender}</p>
          <p>Sport: {userData.sport}</p>
        </div>
        {isEditable && (
          <>
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
              <DeleteUserModal userId={userId} />
            </div>
          </>
        )}
      </div>
    </>
  )
}

const DeleteUserModal = ({ userId }: { userId: string }) => {
  const router = useRouter()
  const [toggleModal, setToggleModal] = useState<boolean>(false)

  const DeleteUser = async () => {
    try {
      toast.loading("Sletter bruker...")
      const response = await fetch(`/api/athletes/${userId}`, {
        method: "delete",
      })

      if (response.ok) {
        toast.dismiss()
        toast.success("Slettet bruker")
        router.push(`/`)
      } else {
        toast.error("Feil ved sletting av bruker")
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <button
        data-modal-target="popup-modal"
        data-modal-toggle="popup-modal"
        onClick={() => {
          setToggleModal(true)
        }}
        className="mb-2 me-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        type="button"
      >
        Slett bruker
      </button>

      {toggleModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black opacity-50"></div>
          <div
            id="popup-modal"
            className={`fixed inset-0 z-50 ${
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              toggleModal ? "" : "hidden"
            } flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 md:inset-0`}
          >
            <div className="relative max-h-full w-full max-w-md p-4">
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
                  <svg
                    className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Er du sikker på at du vil slette denne brukeren?
                  </h3>
                  <button
                    data-modal-hide="popup-modal"
                    onClick={() => DeleteUser()}
                    type="button"
                    className="mb-2 me-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  >
                    Ja, slett brukeren
                  </button>
                  <button
                    data-modal-hide="popup-modal"
                    onClick={() => {
                      setToggleModal(false)
                    }}
                    type="button"
                    className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
                  >
                    Nei, kanseller
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
export default AthleteCard
