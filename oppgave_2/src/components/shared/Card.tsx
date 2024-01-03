import React from "react"

const Card = ({
  title,
  icon,
  children,
}: {
  title: string
  icon: () => React.JSX.Element
  children: React.ReactNode
}) => {
  return (
    <div className="mb-6 mr-4 rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800 sm:mr-6 sm:p-6">
      <div className="flex flex-col items-center sm:flex-row sm:items-start">
        <div className="mb-4 sm:mb-0 sm:mr-4">{icon()}</div>
        <div>
          <h5 className="mb-6 text-lg font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
            {title}
          </h5>
        </div>
      </div>

      {children}
    </div>
  )
}

export default Card
