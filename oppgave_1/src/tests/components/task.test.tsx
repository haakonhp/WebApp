import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import {render, screen} from '@testing-library/react';
import Task from '@/components/Task';
import { useTaskContext } from '@/features/TaskContext';

vi.mock('@/features/TaskContext', () => ({
    useTaskContext: vi.fn(),
}));
vi.mock('@/components/Answer', () => ({
    __esModule: true,
    default: ({ task_id }) => <div>Answer Component for Task ID: {task_id}</div>,
}));

describe('Task Component Tests\n', () => {

    it('Task: renders the current task from context', () => {
        const mockTask = {
            type: 'PLUSS',
            text: 'Skriv resultatet av + 2 + 2 + regneoperasjonen',
        };

        vi.mocked(useTaskContext).mockReturnValue({
            current: mockTask,

        });

        render(<Task />)

        expect(screen.getByText(mockTask.type)).toBeInTheDocument();
        expect(screen.getByText(mockTask.text)).toBeInTheDocument();
    });
});