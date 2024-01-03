import { PrismaClient } from "@prisma/client"
import {Task, Type} from "@/types";
import Generator from "@/features/questions/Generator";

const prisma = new PrismaClient()

export const numberOfTasks: number = 300; // Endre denne verdien for å endre antall matteoppgaver som blir generert ved seed.

async function populateTasks() {
    await prisma.task.deleteMany({});
    const newTasks: Task[] = Generator(numberOfTasks);

        for (const task of newTasks) {
            await prisma.task.create({
                data: {
                    ...task
                }
            })
        }
    }

async function main() {
  populateTasks();
}

main()
