import React from 'react';
import { describe, it, vi, beforeEach, Mock} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import Prompt from '@/components/Prompt';
import { useTaskContext } from "@/features/TaskContext";


vi.mock('@/features/TaskContext', () => ({
    useTaskContext: vi.fn(),
}));

describe('Prompt Component Tests\n', () => {
    beforeEach(() => {
        vi.mocked(useTaskContext).mockReturnValue({
            count: 0,
            current: undefined,
            next(): void {},
            prev(): void {},
            setTaskDone(value: ((prevState: boolean) => boolean) | boolean): void {},
            taskDone: false, tasks: [], userId: 1,
            setTasks: vi.fn()
        });
    });

    it('Prompt: renders without crashing', () => {
        render(<Prompt />);
        expect(screen.getByPlaceholderText('1-10')).toBeInTheDocument();
    });

    it('Prompt: displays error when an invalid number is entered', () => {
        render(<Prompt />);
        const inputElement = screen.getByPlaceholderText('1-10');

        fireEvent.input(inputElement, { target: { value: '11' } });
        fireEvent.click(screen.getByText('Send'));

        expect(screen.getByText('Du må velge et antall mellom 1-10')).toBeInTheDocument();
    });

    it('Prompt: updates input value on user input', async () => {
        render(<Prompt />);

        const input = screen.getByPlaceholderText('1-10');
        fireEvent.input(input, { target: { value: '5' } });
        expect(input).toHaveValue(5);
    });

    it('Prompt: shows error message for invalid input', async () => {
        render(<Prompt />);

        const input = screen.getByPlaceholderText('1-10');
        const sendButton = screen.getByText('Send');

        fireEvent.input(input, { target: { value: '11' } });
        fireEvent.click(sendButton);

        expect(screen.getByText('Du må velge et antall mellom 1-10')).toBeInTheDocument();
    });
});
