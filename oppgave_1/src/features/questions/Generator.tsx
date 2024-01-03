import {Task, Type} from "@/types";

export default function Generator(inputNumber: number) {
    const newTasks: Task[] = [];

    for (let i = 0; i < inputNumber; i++) {
        const number1: number = Math.floor(Math.random() * 120) + 30;
        const number2: number = Math.floor(Math.random() * 13) + 2;
        const types: Type[] = ['pluss', 'minus', 'gange', 'delt på'];
        const type = types[Math.floor(Math.random() * types.length)];
        let data = `${number1}|${number2}`;
        let solution: number;
        let product1: number;
        let product2: number;

        switch (type) {
            case 'pluss':
                solution = number1 + number2;
                product1 = number1;
                product2 = number2;
                break;
            case 'minus':
                solution = number1 - number2;
                product1 = number1;
                product2 = number2;
                break;
            case 'gange':
                solution = number1 * number2;
                product1 = number1;
                product2 = number2;
                break;
            case 'delt på':
                const modulo: number = number1 % number2;

                if (modulo === 0) {
                    product1 = number1;
                    product2 = number2;
                    solution = number1 / number2;
                    data = `${number1}|${number2}`
                    break;
                }

                else {
                    const dividable1: number = number1 - modulo;
                    product1 = dividable1;
                    product2 = number2;
                    solution = dividable1 / number2;
                    data = `${dividable1}|${number2}`;
                    break;
                }

            default:
                throw new Error('Invalid type')
        }

        newTasks.push({
            id: i.toString(),
            text: "Skriv resultatet av " + product1.toString() + " " + type.toString() + " " + product2.toString() + " regneoperasjonen",
            data: data,
            type: type.toUpperCase(),
            solution: solution,
        } as Task);
    }
    return newTasks
};
