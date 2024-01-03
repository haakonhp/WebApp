import React, {useState, useImperativeHandle, forwardRef, useEffect} from "react"
import {toast} from "react-toastify";
import { v4 as uuidv4 } from 'uuid';
import type {QuestionVariant} from "@/types/stringVariants";
import type {Question, QuestionUserAdded} from "@/types/question";
interface QuestionListAddableProps {
    resetSignal: boolean;
    onResetHandled: () => void;
}

const QuestionListAddable = forwardRef((props: QuestionListAddableProps, ref) => {

    // ------- Reset component Logikk             ----- //
    const { resetSignal, onResetHandled } = props;
    useEffect(() => {
        if (resetSignal) {
            // @ts-ignore
            setNumberQuestions('');
            setQuestions(undefined);
            setUserAddedQuestions([]);
            setIsPopupOpen(false);
            setShowInputAndFetchButton(true);

            if (onResetHandled) onResetHandled();
        }
    }, [resetSignal, onResetHandled]);
    /// ---------------------------------------------- //

    // ------- Input Box logic / Antall Spørsmål ----- //
    // @ts-ignore
    const [inputNumberQuestions, setNumberQuestions] = useState<number>('');
    const inputValid = inputNumberQuestions && inputNumberQuestions > 0;
    const handleInput = (event: any) => {
        const { name, value } = event.target;
        switch (name) {
            case 'numberQuestions':
                setNumberQuestions(value);
                break;
            default:
                break;
        }
    };
    /// ---------------------------------------------- //
    // -------------- API hent spørsmål -------------- //
    const [questions, setQuestions] = useState<Question []>();

    const fetchQuestions = async () => {
        try {
            const response = await fetch(`/api/templatequestions`, {
                method: "get",
            });
            const result = (await response.json()) as {data: { data: Question[] } };
            const randomQuestions = getRandomNumberOfQuestions(result.data.data, inputNumberQuestions);
            setQuestions(randomQuestions);
        } catch (error) {
            toast.error("Feil ved henting av Spørsmål / Ingen spørsmål funnet");
            console.error('API error Questions:', error);
        }
    };
    /// ---------------------------------------------- //
    // ------- Funksjon for random antall spørsmål --- //
    const getRandomNumberOfQuestions = (questions: Question[], numberOfQuestions?: number): Question[] => {
        if (!numberOfQuestions || numberOfQuestions >= questions.length) {
            return questions;
        }

        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numberOfQuestions);
    };
    /// --------------------------------------------- //
    // -------------- Add question Logikk ----------- //
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [newQuestionText, setNewQuestionText] = useState('');
    const [newQuestionType, setNewQuestionType] = useState<QuestionVariant>('radio:mood');
    const [userAddedQuestions, setUserAddedQuestions] = useState<QuestionUserAdded[]>([]);
    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    const addNewQuestion = () => {
        const newQuestion: QuestionUserAdded = {
            templateQuestionId: uuidv4(),
            question: newQuestionText,
            type: newQuestionType
        };
        setUserAddedQuestions(prevQuestions => [...prevQuestions, newQuestion]);
        // reset input box felt
        setNewQuestionText('');
        setNewQuestionType('radio:mood');
    };
    /// ------------------------------------------------ //
    // -------------- Send questions til parent -------- //

    useImperativeHandle(ref, () => ({
        getQuestions: () => {
            return [userAddedQuestions, questions];
        }
    }));

    /// ------------------------------------------------ //
    // -- HIDE Antall Spørsmål & Input & Hent Logikk ---- //
    const [showInputAndFetchButton, setShowInputAndFetchButton] = useState(true);
    const handleAddQuestionClick = () => {
        openPopup();
        setShowInputAndFetchButton(false);
    };
    /// ------------------------------------------------ //
    return (
        <>
          <hr className="my-4 h-px border-0 bg-gray-200 dark:bg-gray-700" />

          {showInputAndFetchButton && (
            <div className="flex flex-row">
                {/*------ INPUT NUMBER  -------*/}
                <input
                    type="number"
                    name="numberQuestions"
                    id="numberQuestions"
                    placeholder="Hent X antall spørsmål"
                    value={inputNumberQuestions}
                    onChange={handleInput}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
                {/*------ GET Questions  -------*/}
                {inputValid  &&
                <button
                    type="button"
                    onClick={fetchQuestions}
                    className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Hente Spørsmål
                </button>
                }
            </div>
            )}

            <h2 className="mt-4 mb-6 text-2xl font-extrabold dark:text-white">
                Spørsmål:
            </h2>

            {/*------ QUESTION TABLE  -------*/}
            <div className="relative mb-6 overflow-x-auto">
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
                    {questions?.slice(0, inputNumberQuestions ? Number(inputNumberQuestions) : questions.length)
                        .map((question) => (
                            <React.Fragment key={question.id}>
                                <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <td className="px-6 py-4">
                                        {question.question}
                                    </td>
                                    <td className="px-6 py-4">
                                        {question.type}
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                    <tbody>
                    {userAddedQuestions.map((question) => (
                            <React.Fragment key={question.templateQuestionId}>
                                <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <td className="px-6 py-4">
                                        {question.question}
                                    </td>
                                    <td className="px-6 py-4">
                                        {question.type}
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>

                <hr className="my-2 h-px border-0 bg-gray-200 dark:bg-gray-700" />

                {/*------ ADD QUESTIONS TO LIST  -------*/}
                <button
                    type="button"
                    onClick={handleAddQuestionClick}
                    className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Legg til nytt spørsmål
                </button>

                {isPopupOpen && (
                    <div className="popup">
                        <div className="popup-inner">
                            <input
                                type="text"
                                value={newQuestionText}
                                onChange={(e) => setNewQuestionText(e.target.value)}
                                placeholder="Legg inn spørsmålstekst?"
                                className="mr-4"
                            />
                            <select
                                value={newQuestionType}
                                onChange={(e) => setNewQuestionType(e.target.value as QuestionVariant)}
                                className="mr-4">
                                <option value="radio:mood">Radio: Mood</option>
                                <option value="radio:range">Radio: Range</option>
                                <option value="text">Text</option>
                            </select>
                            <button
                                onClick={() => {
                                    addNewQuestion();
                                    closePopup();
                                }}
                                className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Legg til
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
});
export default QuestionListAddable;
