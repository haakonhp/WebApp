"use client"

import React, { useState } from "react"

import { Modal } from "./Modal"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="border-gray-200 bg-blue-600 dark:bg-gray-900">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center whitespace-nowrap text-2xl font-semibold text-white dark:text-white">
            Oppgave 2
          </span>
        </a>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          onClick={toggleMenu}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Åpne meny</span>
          <svg
            className="h-5 w-5 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-blue-600 p-4 font-medium rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:p-0 md:dark:bg-gray-900">
            <li className="flex items-center">
              <a
                href="/"
                className="block rounded bg-blue-600 px-3 py-2 text-white dark:bg-transparent dark:text-blue-500 md:p-0 md:text-white md:dark:text-blue-500"
                aria-current="page"
              >
                Hjem
              </a>
            </li>
            {/* Funksjon for å åpne modal */}
            {!isMenuOpen ? (
              <Modal />
            ) : (
              <a
                href="/"
                className="block rounded bg-blue-600 px-3 py-2 text-white dark:bg-transparent dark:text-blue-500 md:p-0 md:text-white md:dark:text-blue-500"
                aria-current="page"
              >
                Notifikasjon
              </a>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
