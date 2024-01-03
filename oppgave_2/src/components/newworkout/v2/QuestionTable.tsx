import React from "react"
import type { Question } from "@/types/question"

import Loading from "@/components/shared/Loading"

const QuestionTable = ({
  questions,
}: {
  questions: Question[] | null | undefined
}) => {
  if (questions === undefined) {
    return <Loading />
  } else {
    return (
      <div className="relative mb-6 max-h-96 overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Spørsmål
              </th>
              <th scope="col" className="px-6 py-3">
                Type
              </th>
            </tr>
          </thead>
          <tbody>
            {questions?.map((item) => (
              <React.Fragment key={item.id}>
                <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                  >
                    {item.question}
                  </th>
                  <td className="px-6 py-4">{item.type}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default QuestionTable
