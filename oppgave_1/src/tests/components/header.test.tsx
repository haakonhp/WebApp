import React from "react"
import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';

const tasksLength = new Array(10).fill(null);
let count = 4;
vi.mock('@/features/TaskContext', () => {
    return {
        useTaskContext: () => ({
            count: count,
            tasks: tasksLength,
        }),
    };
});

describe('Header Component Tests\n', () => {

    it('Header: Renders header with correct task count', () => {
        render(<Header />);
        const headerElement = `Oppgave ${count + 1} av ${tasksLength.length}`;
        expect(screen.getByRole('heading')).toHaveTextContent(headerElement);
    });

    it('Header: Updates the task number when the prop changes', () => {
        // Render count + 1 (6) av array length(5)
        count = 5;
        const { rerender } = render(<Header />);
        const headerElementOne = `Oppgave ${count + 1} av ${tasksLength.length}`;
        expect(screen.getByRole('heading')).toHaveTextContent(headerElementOne);

        count = 6;
        rerender(<Header />);
        const headerElementTwo = `Oppgave ${count + 1} av ${tasksLength.length}`;
        expect(screen.getByRole('heading')).toHaveTextContent(headerElementTwo);

    });

});
