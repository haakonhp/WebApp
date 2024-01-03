import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useTaskContext} from "../../features/TaskContext";

const TestComponent = () => {
    const { count, tasks, taskDone } = useTaskContext();

    return (
        <div>
            <div data-testid="count">{count}</div>
            <div data-testid="tasks-length">{tasks.length}</div>
            <div data-testid="task-done">{taskDone ? 'Done' : 'Not Done'}</div>
        </div>
    );
};

describe('TaskContext: Feature: Tests\n', () => {
    it('TaskContext: throws an error when useTaskContext is used outside of TaskProvider', () => {
        const consoleError = console.error;
        console.error = vi.fn();

        expect(() => render(<TestComponent />)).toThrow('TaskContext needs a TaskProvider');

        console.error = consoleError;
    });
});