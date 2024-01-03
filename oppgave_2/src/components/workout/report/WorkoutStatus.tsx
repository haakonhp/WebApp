const WorkoutStatus = ({
  status,
  setStatus,
}: {
  status: string
  setStatus: React.Dispatch<React.SetStateAction<string>>
}) => {
  return (
    <>
      <select
        id="status"
        onChange={(e) => {
          setStatus(e.currentTarget.value)
        }}
        value={status}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      >
        <option value="no">No</option>
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
      </select>
    </>
  )
}

export default WorkoutStatus
