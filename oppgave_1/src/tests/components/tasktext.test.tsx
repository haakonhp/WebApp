import React from "react"
import { describe, it } from 'vitest';
import {render, screen} from '@testing-library/react';
import TaskText from '@/components/TaskText';

describe('TaskText Component Tests\n', () => {
    it('TaskText: renders the text passed to it', () => {
        const text = "Hva blir resultatet av regneoperasjonen?"
        render(<TaskText text={text} />)
        const taskTextElement = screen.getByText(text)

        expect(taskTextElement).toBeInTheDocument()
    });
    it("TaskText: applies the correct CSS class", () => {
        const text = "Hva blir resultatet av regneoperasjonen?"
        render(<TaskText text={text} />)
        const taskTextElement = screen.getByText(text)

        expect(taskTextElement).toHaveClass("text-sm text-slate-400")
    })
});