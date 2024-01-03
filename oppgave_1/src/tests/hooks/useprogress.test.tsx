import React from "react"
import { act, renderHook } from "@testing-library/react"
import useProgress from "@/hooks/useProgress"
import {vi, expect} from "vitest";
import Generator from "@/features/questions/Generator";
import {numberOfTasks} from "../../../prisma/seed";


describe("UseProgress Function Tests\n", () => {
    const tasks = Generator(numberOfTasks);

    it("UseProgress: initializes with count as 0 and returns the current task", () => {
        const { result } = renderHook(() => useProgress({ tasks: tasks }))

        expect(result.current.count).toBe(0)
        expect(result.current.current).toEqual(tasks[0])
    })

    it("UseProgress: updates count when next is called", () => {
        const { result } = renderHook(() => useProgress({ tasks }))

        act(() => {
            result.current.next()
        })

        expect(result.current.count).toBe(1)
        expect(result.current.current).toEqual(tasks[1])
    })

    it("UseProgress: updates count when next is called", () => {
        const { result } = renderHook(() => useProgress({ tasks }))

        // 0 + 1 = 1
        act(() => {
            result.current.next()
        })
        // 1 + 1 = 2
        act(() => {
            result.current.next()
        })
        // 2 - 1 = 1
        act(() => {
            result.current.prev()
        })

        expect(result.current.count).toBe(1)
        expect(result.current.current).toEqual(tasks[1])
    })

    it("UseProgress: does not decrement count below 0", () => {
        const { result } = renderHook(() => useProgress({ tasks: tasks }));

        act(() => {
            result.current.prev();
        });

        expect(result.current.count).toBe(0);
        expect(result.current.current).toEqual(tasks[0]);
    });

    it("UseProgress: does not increment count beyond the task array length", () => {
        const { result } = renderHook(() => useProgress({ tasks }))

        act(() => {
            for (let i = 0; i < tasks.length + 1; i++) {
            result.current.next()
            }
        });

        expect(result.current.count).toBe(tasks.length - 1)
        expect(result.current.current).toEqual(tasks[tasks.length - 1])
    })
});
