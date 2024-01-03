"use client"

import React, { useRef, useState } from "react"
import { toast } from "react-toastify"

import { SelectSport } from "@/components/athlete/athleteData/AthleteEditCard"
import WorkoutList from "@/components/shared/WorkoutList"
import { type Sport } from "@/types/stringVariants"
import QuestionListAddable from "../shared/QuestionListAddable"

export default function NewTemplate() {
  // ------------- Slugify Logic ------------------- //
  // found at: https://byby.dev/js-slugify-string 23/11-2023 //
  const slug = require("lodash")
  /// -------------------------------------------- ///
  // -------------- Input Box logic --------------- //
  const [inputWorkoutName, setWorkoutName] = useState("")
  const [inputTags, setTags] = useState("")
  const [inputSlug, setSlug] = useState("")

  const handleInput = (event: any) => {
    const { name, value } = event.target
    switch (name) {
      case "workoutName":
        setWorkoutName(value)
        setSlug(slug.kebabCase(value))
        break
      case "tags":
        setTags(value)
        break
      case "slug":
        setSlug(value)
        break
      default:
        break
    }
  }
  /// ----------------------------------------------- ///
  // ------------ Dropdown logic --------------------- //
  const [dropdownSport, setDropdownSport] = useState<string | undefined>(
    undefined,
  )

  const handleDropdownChange = (e: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setDropdownSport(e.target.value as Sport)
  }
  /// ----------------------------------------------- ///
  // ------------ Checkbox logic --------------------- //
  const [intensityChecked, setIntensityChecked] = useState(false)
  const [wattChecked, setWattChecked] = useState(false)
  const [speedChecked, setSpeedChecked] = useState(false)
  const [heartrateChecked, setHeartrateChecked] = useState(false)

  const handleCheckboxChange = (event: any) => {
    const { name, checked } = event.target
    switch (name) {
      case "intensity":
        setIntensityChecked(checked)
        break
      case "watt":
        setWattChecked(checked)
        break
      case "speed":
        setSpeedChecked(checked)
        break
      case "heartrate":
        setHeartrateChecked(checked)
        break
      default:
        break
    }
  }
  const isAnyCheckboxChecked =
    intensityChecked || wattChecked || speedChecked || heartrateChecked
  /// ----------------------------------------------- ///
  // ------------ Send Template Logic  --------------- //
  const workoutListRef = useRef<{ getWorkoutRows: () => ReturnType<any> }>(null)
  const questionListRef = useRef<{ getQuestions: () => ReturnType<any> }>(null)

  const submitTemplateToAPI = async () => {
    const tagsArray = inputTags.split(",").map((tag) => tag.trim())
    const questions = questionListRef.current?.getQuestions()
    const flattenedQuestions = questions.flat()
    const intervals = workoutListRef.current?.getWorkoutRows()

    const requestBody = {
      name: inputWorkoutName,
      tags: tagsArray,
      slug: inputSlug,
      sport: dropdownSport,
      questions: flattenedQuestions,
      intervals: intervals,
      intensityChecked: intensityChecked,
      wattChecked: wattChecked,
      speedChecked: speedChecked,
      heartrateChecked: heartrateChecked,
    }

    try {
      const response = await fetch("/api/templates/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const responseData = await response.json()
      toast.success("Mal lagret")
      resetForm()
    } catch (error) {
      toast.error("Feil Lagring av Template, er alle felter fylt ut?")
      console.error("Error:", error)
    }
  }
  /// ------------------------------------------------ //
  // ------------ Reset skjema Logic ----------------- //
  const [resetQuestionList, setResetQuestionList] = useState(false)
  const resetForm = () => {
    setWorkoutName("")
    setTags("")
    setSlug("")
    setDropdownSport("")
    setIntensityChecked(false)
    setWattChecked(false)
    setSpeedChecked(false)
    setHeartrateChecked(false)
    setResetQuestionList(true)
  }
  /// ------------------------------------------------ //
  return (
    <>
      <div className="mb-2 flex flex-col justify-between">
        <h3 className="text-1xl mb-2 font-extrabold dark:text-white">
          Økt Navn:
        </h3>
        {/*------ INPUT Name-------*/}
        <input
          type="text"
          name="workoutName"
          id="workoutName"
          placeholder="f.eks. styrke trening"
          value={inputWorkoutName}
          onChange={handleInput}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>
      <div className="mb-2 flex flex-col justify-between">
        <h3 className="text-1xl mb-2 font-extrabold dark:text-white">Tags:</h3>
        {/*------ INPUT Tags-------*/}
        <input
          type="text"
          name="tags"
          id="tags"
          placeholder="f.eks. uphill, hard, cycling"
          value={inputTags}
          onChange={handleInput}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>
      <div className="mb-2 flex flex-col justify-between">
        <h3 className="text-1xl mb-2 font-extrabold dark:text-white">Slug:</h3>
        {/*------ INPUT Slug -------*/}
        <input
          type="text"
          name="slug"
          id="slug"
          placeholder="blir auto utfylt"
          value={inputSlug}
          onChange={handleInput}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>
      <div className="mb-2 flex flex-col justify-between">
        {/*------ DROPDOWN Sport -------*/}
        <SelectSport sport={dropdownSport} setSport={setDropdownSport} />
      </div>

      <QuestionListAddable
        ref={questionListRef}
        resetSignal={resetQuestionList}
        onResetHandled={() => {
          setResetQuestionList(false)
        }}
      />
      <hr className="my-5 h-px border-0 bg-gray-200 dark:bg-gray-700" />
      <div className="mb-2 flex flex-col justify-between">
        <h3 className="text-1xl mb-6 font-extrabold dark:text-white">
          Sett Måleparameter:
        </h3>
        <div className="mb-2 flex flex-row justify-start">
          <div className="text-1xl mr-4 font-bold dark:text-white">
            {/*------ CHECKBOX INTENSITY -------*/}
            <input
              type="checkbox"
              id="intensity"
              name="intensity"
              checked={intensityChecked}
              onChange={handleCheckboxChange}
              className="mr-2 h-6 w-6"
            />
            <label htmlFor="intensity">Opplevd Intensitet</label>
          </div>
          <div className="text-1xl mr-4 font-bold dark:text-white">
            {/*------ CHECKBOX WATT -------*/}
            <input
              type="checkbox"
              id="watt"
              name="watt"
              checked={wattChecked}
              onChange={handleCheckboxChange}
              className="mr-2 h-6 w-6"
            />
            <label htmlFor="watt">Watt</label>
          </div>
          <div className="text-1xl mr-4 font-bold dark:text-white">
            {/*------ CHECKBOX SPEED -------*/}
            <input
              type="checkbox"
              id="speed"
              name="speed"
              checked={speedChecked}
              onChange={handleCheckboxChange}
              className="mr-2 h-6 w-6"
            />
            <label htmlFor="speed">Hastighet</label>
          </div>
          <div className="text-1xl mr-4 font-bold dark:text-white">
            {/*------ CHECKBOX HEARTRATE -------*/}
            <input
              type="checkbox"
              id="heartrate"
              name="heartrate"
              checked={heartrateChecked}
              onChange={handleCheckboxChange}
              className="mr-2 h-6 w-6"
            />
            <label htmlFor="heartrate">Puls</label>
          </div>
        </div>
      </div>
      <h2 className="mb-6 text-2xl font-extrabold dark:text-white">Økter:</h2>
      {isAnyCheckboxChecked && <WorkoutList ref={workoutListRef} />}
      <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />
      <div className="flex flex-row justify-start">
        <button
          type="button"
          onClick={resetForm}
          className="mb-2 me-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-700"
        >
          Slett
        </button>
        {isAnyCheckboxChecked && (
          <button
            type="button"
            onClick={submitTemplateToAPI}
            className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Opprette Mal
          </button>
        )}
      </div>
    </>
  )
}
