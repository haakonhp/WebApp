import { expect } from "@playwright/test";
import Generator from "@/features/questions/Generator";
import {numberOfTasks} from "../../../prisma/seed";
describe("Generator Function Tests\n", () => {

    it("Generator: NumberOfTasks: that tests generated is over 1", () => {
        expect((Generator(numberOfTasks).length) / 5).toBeGreaterThan(1)
    })

    it("Generator: NumberOfTasks: that tests generated is not more than the variable numberOfTasks from seed.ts", () => {
        expect((Generator(numberOfTasks).length) / 5).toBeLessThanOrEqual(numberOfTasks)
    })

   it("Generator: NumbersGenerated: Number1: is between 1-165", () => {
       const tasks = Generator(numberOfTasks);
       for (const task of tasks) {
           const [number1, ] = task.data.split('|').map(Number);
           expect(number1).toBeGreaterThanOrEqual(1);
           expect(number1).toBeLessThanOrEqual(150);
       }
   })

    it("Generator: NumbersGenerated: Number2: is between 1-16", () => {
        const tasks = Generator(numberOfTasks);
        for (const task of tasks) {
            const [, number2] = task.data.split('|').map(Number);
            expect(number2).toBeGreaterThanOrEqual(2);
            expect(number2).toBeLessThanOrEqual(15);
        }
    })

    it("Generator: NumbersGenerated: Number 1 >= Number 2", () => {
        const tasks = Generator(numberOfTasks);
        for (const task of tasks) {
            const [number1, ] = task.data.split('|').map(Number);
            const [, number2] = task.data.split('|').map(Number);
            expect(number1).toBeGreaterThanOrEqual(number2);
        }
    })

    it("Generator: PLUSS: tasks have a solution that is the sum of number1 and number2", () => {
        const tasks = Generator(numberOfTasks).filter(task => task.type === 'pluss');
        for (const task of tasks) {
            const [number1, number2] = task.data.split('|').map(Number);
            expect(task.solution).toBe(number1 + number2);
        }
    })

    it("Generator: MINUS: tasks have a solution that is the product of number1 and number2", () => {
        const tasks = Generator(numberOfTasks).filter(task => task.type === 'pluss');
        for (const task of tasks) {
            const [number1, number2] = task.data.split('|').map(Number);
            expect(task.solution).toBe(number1 - number2);
        }
    })

    it("Generator: GANGE: tasks have a solution that is the product of number1 and number2", () => {
        const tasks = Generator(numberOfTasks).filter(task => task.type === 'pluss');
        for (const task of tasks) {
            const [number1, number2] = task.data.split('|').map(Number);
            expect(task.solution).toBe(number1 * number2);
        }
    })

    it("Generator: DELE: tasks have a solution that is the product of number1 and number2", () => {
        const tasks = Generator(numberOfTasks).filter(task => task.type === 'pluss');
        for (const task of tasks) {
            const [number1, number2] = task.data.split('|').map(Number);
            expect(task.solution).toBe(number1 / number2);
        }
    })

    it("Generator: DELE: that number1 is not 0", () => {
        const tasks = Generator(numberOfTasks).filter(task => task.type === 'delt på');
        for (const task of tasks) {
            const [number1] = task.data.split('|').map(Number);
            expect(number1).not.toBe(0);
        }
    })

    it("Generator: DELE: that number2 is not 0", () => {
        const tasks = Generator(numberOfTasks).filter(task => task.type === 'delt på');
        for (const task of tasks) {
            const [number2] = task.data.split('|').map(Number);
            expect(number2).not.toBe(0);
        }
    })

    it("Generator: ALL: that product1 = number1 & product 2 = number2", () => {
        const tasks = Generator(numberOfTasks).filter(task => task.type === 'minus');
        for (const task of tasks) {
            const [number1, number2] = task.data.split('|').map(Number);
            expect(task.text.includes(number1.toString())).toBeTruthy();
            expect(task.text.includes(number2.toString())).toBeTruthy();
        }
    })

});