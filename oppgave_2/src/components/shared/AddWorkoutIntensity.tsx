const AddWorkoutIntensity = ({
  intensityData,
  setIntensityData,
}: {
  intensityData: {
    duration: number
    intensity: number
  }[]
  setIntensityData: React.Dispatch<
    React.SetStateAction<
      {
        duration: number
        intensity: number
      }[]
    >
  >
}) => {
  // ------------ Legg til ny rad Logikk ------------- //
  const addNewRow = () => {
    const newRow = { duration: 0, intensity: 0 }
    setIntensityData([...intensityData, newRow])
  }

  const handleInputChange = (index: number, field: string, value: number) => {
    const updatedRows = intensityData.map((intensity, i) =>
      index === i ? { ...intensity, [field]: value } : intensity,
    )
    setIntensityData(updatedRows)
  }

  return (
    <>
      <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />

      <h2 className="mb-6 text-xl font-extrabold dark:text-white">
        Økter
      </h2>
      <div className="relative mb-6 overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Intervall
              </th>
              <th scope="col" className="px-6 py-3">
                Varighet
              </th>
              <th scope="col" className="px-6 py-3">
                Intensitets Sone
              </th>
            </tr>
          </thead>

          <tbody>
            {intensityData.map((row, index) => (
              <tr
                key={index}
                className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    placeholder="minutter"
                    value={row.duration}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "duration",
                        parseInt(e.target.value),
                      )
                    }
                    className="input-class"
                  />
                </td>
                <td className="px-6 py-4">
                  <select
                    value={row.intensity}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "intensity",
                        parseInt(e.target.value),
                      )
                    }
                    className="input-class"
                  >
                    <option value={-1}>velg sone</option>
                    <option value={1}>1=50%</option>
                    <option value={2}>2=60%</option>
                    <option value={3}>3=70%</option>
                    <option value={4}>4=80%</option>
                    <option value={5}>5=90%</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="button"
          onClick={addNewRow}
          className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Legg til Intervall
        </button>
      </div>
    </>
  )
}
export default AddWorkoutIntensity
