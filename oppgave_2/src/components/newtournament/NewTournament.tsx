"use client"

import React from "react";
import {useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from 'uuid';
import {type Tournament} from "@/types/tournament";
import {useRouter} from "next/navigation";
import {SelectSport} from "@/components/athlete/athleteData/AthleteEditCard";
import {Sport} from "@/types/stringVariants";

export default function NewTournament({ params }: { params: { userId: string } }) {
    const userId = params.userId
    const router = useRouter()
    // ------------- Dato Logic ------------------- //
    const formatDate = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        return date.toISOString();
    };
    const formatTableDate = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}-${year}`;
    };
    /// -------------------------------------------- ///
    // ------------ Checkbox logic --------------------- //
    const [priAChecked, setPriAChecked] = useState(false);
    const [priBChecked, setPriBChecked] = useState(false);
    const [priCChecked, setPriCChecked] = useState(false);
    const [priorityNumber, setPriorityNumber] = useState(0);
    const handleCheckboxChange = (event: any) => {
        const { name, checked } = event.target;
        switch (name) {
            case 'priA':
                setPriAChecked(checked);
                setPriorityNumber(1);
                setPriBChecked(false);
                setPriCChecked(false);
                break;
            case 'priB':
                setPriBChecked(checked);
                setPriorityNumber(2);
                setPriAChecked(false);
                setPriCChecked(false);
                break;
            case 'priC':
                setPriCChecked(checked);
                setPriorityNumber(3);
                setPriAChecked(false);
                setPriBChecked(false);
                break;
            default:
                break;
        }
    };
    /// ----------------------------------------------- ///
    // -------------- Input Box logic --------------- //

    const [inputTournamentName, setTournamentName] = useState<string>('');
    const [inputDate, setDate] = useState('');
    const [inputLocation, setLocation] = useState<string>('');
    const [inputGoal, setGoal] = useState<string>('');
    const [inputComment, setComment] = useState<string>('');


    const handleInput = (event: any) => {
        const { name, value } = event.target;
        switch (name) {
            case 'tournamentName':
                setTournamentName(value);
                break;
            case "date":
                setDate(value)
                break
            case "location":
                setLocation(value)
                break
            case 'goal':
                setGoal(value);
                break;
            case 'comment':
                setComment(value);
                break;
            default:
                break;
        }
    };
    /// ----------------------------------------------- ///
    // ------------ Dropdown logic --------------------- //
    const [dropdownSport, setDropdownSport] = useState<string | undefined>(undefined);

    const handleDropdownChange = (e: {
        target: { value: React.SetStateAction<string> }
    }) => {
        setDropdownSport(e.target.value as Sport)
    }
    /// ----------------------------------------------- ///
    // ---------------- API Get Tournaments ------------------ //
    const [tournaments, setTournaments] = useState<Tournament[] | undefined | null>(undefined)
    const fetchTournaments = async () => {
        try {
            const response = await fetch(`/api/athletes/${userId}/tournaments/`, {
                method: "get",
            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const result = (await response.json()) as {
                data: { data: Tournament[] | null }
            }
            setTournaments(result.data.data)

        } catch (error) {
            toast.error("Feil ved henting av Konkurranser / Ingen Konkurranser lagt inn")
            console.error("API error Tournaments:", error)
        }
    };
    useEffect(() => {
        fetchTournaments()
    }, [userId]);
    /// ------------------------------------------------ //
    //-------------- ADD new tournamant via API to database  --------- //
    const sendTournaments = async () => {
        const currentTime = new Date().toISOString();
        const generatePrefixedUUID = (prefix: string) => {
            return `${prefix}${uuidv4()}`;
        };
        const prefixedUUID = generatePrefixedUUID("tournament-");
        const requestBody = {
            id: prefixedUUID,
            description: inputComment,
            goal: inputGoal,
            name: inputTournamentName,
            priority: priorityNumber,
            createdAt: currentTime,
            userId: userId,
            date: formatDate(inputDate),
            location: inputLocation,
            sport: dropdownSport
        };
        try {
            const response = await fetch('/api/tournaments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                if (response.status === 409) {
                    toast.error("Konkurranse med samme prioritet allerede lagt inn, velg en annen prioritering!");
                } else {
                    throw new Error(`HTTP error: ${response.status}`);
                }
            } else
                {
                    toast.success("Konkurranse lagt til!")
                    await fetchTournaments();
                    resetForm();
                }

        } catch (error) {
            console.error('Error:', error);
            toast.error("Noe gikk galt. Kunne ikke lagre data!");
        }
    };
    /// ------------------------------------------------ //
    // ------------ Reset skjema Logic ----------------- //
    const resetForm = () => {
        setTournamentName('')
        setGoal('')
        setComment('')
        setDate('')
        setLocation('')
        setPriAChecked(false)
        setPriBChecked(false)
        setPriCChecked(false)
    }
    /// ------------------------------------------------ //
    return (
        <>
            <div className="mb-2 flex flex-col justify-between">
                <h3 className="text-1xl mb-2 font-extrabold dark:text-white">
                    Navn:
                </h3>
                {/*------ INPUT Name-------*/}
                <input
                    type="text"
                    name="tournamentName"
                    id="tournamentName"
                    placeholder="f.eks. Norgesmesterskap"
                    value={inputTournamentName}
                    onChange={handleInput}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
            </div>
            <div className="mb-2 flex flex-col justify-between">
                <h3 className="text-1xl mb-2 font-extrabold dark:text-white">
                    Dato:
                </h3>
                {/*------ INPUT Date -------*/}
                <input
                    type="date"
                    name="date"
                    id="date"
                    value={inputDate}
                    onChange={handleInput}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
            </div>
            <div className="mb-2 flex flex-col justify-between">
                <h3 className="text-1xl mb-2 font-extrabold dark:text-white">
                    Sted:
                </h3>
                {/*------ INPUT Loaction -------*/}
                <input
                    type="text"
                    name="location"
                    id="location"
                    placeholder="f.eks. Oslo"
                    value={inputLocation}
                    onChange={handleInput}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
            </div>
            <div className="mb-2 flex flex-col justify-between">
                <h3 className="text-1xl mb-2 font-extrabold dark:text-white">
                    Mål:
                </h3>
                {/*------ INPUT Goal -------*/}
                <input
                    type="text"
                    name="goal"
                    id="goal"
                    placeholder="feks. 2. plass"
                    value={inputGoal}
                    onChange={handleInput}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
            </div>
            <div className="mb-2 flex flex-col justify-between">
                {/*------ INPUT Sport -------*/}
                <SelectSport sport={dropdownSport} setSport={setDropdownSport} />
            </div>
            <div className="mb-2 flex flex-col justify-between">
                <h3 className="text-1xl mb-2 font-extrabold dark:text-white">
                    Prioritet:
                </h3>
                <div className="mb-2 flex flex-row justify-start">
                <div className="mr-4 text-1xl font-bold dark:text-white">
                    {/*------ CHECKBOX A -------*/}
                    <input
                        type="checkbox"
                        id="priA"
                        name="priA"
                        checked={priAChecked}
                        onChange={handleCheckboxChange}
                        className="mr-2 h-6 w-6"
                    />
                    <label htmlFor="intensity">A</label>
                </div>
                <div className="mr-4 text-1xl font-bold dark:text-white">
                    {/*------ CHECKBOX B -------*/}
                    <input
                        type="checkbox"
                        id="priB"
                        name="priB"
                        checked={priBChecked}
                        onChange={handleCheckboxChange}
                        className="mr-2 h-6 w-6"
                    />
                    <label htmlFor="watt">B</label>
                </div>
                <div className="mr-4 text-1xl font-bold dark:text-white">
                    {/*------ CHECKBOX C -------*/}
                    <input
                        type="checkbox"
                        id="priC"
                        name="priC"
                        checked={priCChecked}
                        onChange={handleCheckboxChange}
                        className="mr-2 h-6 w-6"
                    />
                    <label htmlFor="speed">C</label>
                </div>
            </div>
            </div>
            <div className="mb-2 flex flex-col justify-between">
                <h3 className="text-1xl mb-2 font-extrabold dark:text-white">
                    Kommentar:
                </h3>
                {/*------ INPUT Comment -------*/}
                <input
                    type="text"
                    name="comment"
                    id="comment"
                    placeholder="f.eks. kom på 7. plass ifjor"
                    value={inputComment}
                    onChange={handleInput}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
            </div>

            <hr className="my-5 h-px border-0 bg-gray-200 dark:bg-gray-700" />

            <div className="flex flex-row justify-start">
                <button
                    type="button"
                    onClick={sendTournaments }
                    className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Legg til konkurranse
                </button>
            </div>

            <hr className="my-5 h-px border-0 bg-gray-200 dark:bg-gray-700" />

            <h2 className="mb-6 text-2xl font-extrabold dark:text-white">
                Konkurranser:
            </h2>
            {/*------ TOURNAMENT TABLE  -------*/}
            <div className="relative mb-6 overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Navn
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Dato
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Sted
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Mål
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Sport
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Prioritet
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Kommentar
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {tournaments?.map((tournament) => (
                        <React.Fragment key={tournament.id}>
                            <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                                <td className="px-6 py-4">
                                    {tournament.name}
                                </td>
                                <td className="px-6 py-4">
                                    {formatTableDate(tournament.date)}
                                </td>
                                <td className="px-6 py-4">
                                    {tournament.location}
                                </td>
                                <td className="px-6 py-4">
                                    {tournament.goal}
                                </td>
                                <td className="px-6 py-4">
                                    {tournament.sport}
                                </td>

                                <td className="px-6 py-4">
                                    {tournament.priority === 1 ? 'A' :
                                        tournament.priority === 2 ? 'B' :
                                            tournament.priority === 3 ? 'C' : ''}
                                </td>
                                <td className="px-6 py-4">
                                    {tournament.description}
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>
                <button
                    type="button"
                    onClick={() => {
                        router.push(`/athlete/${userId}`)
                    }}
                    className="mt-4 mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Tilbake til utøver profil
                </button>
            </div>
        </>
    )
};