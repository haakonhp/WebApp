import React from "react"

type CheckBoxTypes = {
  intensityChecked: boolean | undefined
  setIntensityChecked: React.Dispatch<React.SetStateAction<boolean | undefined>>
  wattChecked: boolean | undefined
  setWattChecked: React.Dispatch<React.SetStateAction<boolean | undefined>>
  speedChecked: boolean | undefined
  setSpeedChecked: React.Dispatch<React.SetStateAction<boolean | undefined>>
  heartrateChecked: boolean | undefined
  setHeartrateChecked: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

const ActivityCheckbox = ({
  intensityChecked,
  setIntensityChecked,
  wattChecked,
  setWattChecked,
  speedChecked,
  setSpeedChecked,
  heartrateChecked,
  setHeartrateChecked,
}: CheckBoxTypes) => {
  return (
    <>
      <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />
      <h2 className="mb-6 text-xl font-extrabold dark:text-white">
        Sett Måleparametere
      </h2>
      <div>
        <input
          id="checkbox-table-search-intensity"
          onChange={() => {
            setIntensityChecked(!intensityChecked)
          }}
          type="checkbox"
          className="mr-3 h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
        />
        <label htmlFor="checkbox-table-search-1">Opplevd intensitet</label>
      </div>
      <div>
        <input
          id="checkbox-table-search-watt"
          onChange={() => {
            setHeartrateChecked(!heartrateChecked)
          }}
          type="checkbox"
          className="mr-3 h-4 w-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
        />
        <label htmlFor="checkbox-table-search-1">Puls</label>
      </div>

      <div>
        <input
          id="checkbox-table-search-heartrate"
          onChange={() => {
            setWattChecked(!wattChecked)
          }}
          type="checkbox"
          className="mr-3 h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
        />
        <label htmlFor="checkbox-table-search-1">Watt</label>
      </div>
      <div>
        <input
          id="checkbox-table-search-speed"
          onChange={() => {
            setSpeedChecked(!speedChecked)
          }}
          type="checkbox"
          className="mr-3 h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
        />
        <label htmlFor="checkbox-table-search-1">Hastighet</label>
      </div>
    </>
  )
}

export default ActivityCheckbox
