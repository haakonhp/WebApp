"use client"

import {useState, useEffect} from "react";

import {useTaskContext} from "@/features/TaskContext";
import {useRouter} from "next/navigation";

type ResponseType = {
    data: {
        success: boolean
        data: {
            successfulTasks: number
            mostDifficultOperation: string
            mostDifficultOperationErrors: number
        }
    }
}

export default function Result() {
    const [result, setResult] = useState<ResponseType | null>(null);

    const {userId, setUserId, setTasks, setCount, fetchQuestions} = useTaskContext();

    const router = useRouter();

    const fetchResults = async () => {
        try {
            const response = await fetch(`api/aggregate?userId=${userId}`);
            const data = await response.json() as ResponseType;
            setResult(data);
            setTasks([]);
        } catch (error) {
            console.error(error);
        }
    };

    const newTasks = () => {
        setUserId(Math.floor(Math.random() * 100000))
        setCount(0)
        router.push("/");
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            fetchResults();
        }
    }, [userId]);


    const capitalizeFirstOnly = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    return (
        <div>
            <p>Total poeng: {result?.data?.data?.successfulTasks}</p>
            <p>Du må øve mest på: {capitalizeFirstOnly(result?.data?.data?.mostDifficultOperation ?? '')}</p>
            <p>I denne kategorien har du: {result?.data?.data?.mostDifficultOperationErrors} feil</p>

            <button className="bg-blue-500" onClick={() => newTasks()}>
                Start på nytt
            </button>
        </div>
    );
}