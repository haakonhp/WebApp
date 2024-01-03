import React from "react"
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import Answer from '@/components/Answer';

describe('Answer Component Tests', () => {

    it('Answer: Render: Renders Correctly', () => {
        vi.mock('@/features/TaskContext', () => ({
            useTaskContext: vi.fn().mockReturnValue({
                userId: '1',
                setTaskDone: vi.fn,
            }),
        }));
        render(<Answer task_id={'1'} />);
        const inputElement = screen.getByPlaceholderText('Sett svar her');
        expect(inputElement).toBeVisible();
        expect(screen.getByText('Send')).toBeVisible();
        expect(screen.getByText('Svar')).toBeInTheDocument();
    });

    it('Answer: Displays: "0 av 3 forsøk', async () => {
        vi.mock('@/features/TaskContext', () => ({
            useTaskContext: vi.fn().mockReturnValue({
                userId: '1',
                setTaskDone: vi.fn,
            }),
        }));
        render(<Answer task_id={'1'}/>);
        const sucessMessage = await screen.findByText("0 av 3 forsøk");
        expect(sucessMessage).toBeInTheDocument();
    });

    it('Answer: Button: Calls handleSubmit on button click', async () => {
        vi.mock('@/features/TaskContext', () => ({
            useTaskContext: vi.fn().mockReturnValue({
                userId: '1',
                setTaskDone: vi.fn(),
            }),
        }));
        render(<Answer task_id={'1'} />);
        const button = screen.getByRole('button', { name: /send/i });
        fireEvent.click(button);
    });
});
