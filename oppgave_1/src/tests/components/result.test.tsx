import React from "react";
import { describe, it, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import Result from '@/components/Result';


const mockFetchData = {
  data: {
    success: true,
    data: {
      successfulTasks: 3,
      mostDifficultOperation: 'Dele',
      mostDifficultOperationErrors: 1,
    }
  }
};

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/features/TaskContext', () => ({
  useTaskContext: () => ({
    userId: 1,
    setUserId: vi.fn(),
    setTasks: vi.fn(),
    fetchQuestions: vi.fn(),
  }),
}));

describe('Result Component Tests\n', () => {
  it('Result: Renders with correct data', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockFetchData),
      })
    );

    await act(async () => {
      render(<Result />);
    });

    expect(screen.getByText(/Total poeng: 3/i)).toBeInTheDocument();
    expect(screen.getByText(/Du må øve mest på: Dele/i)).toBeInTheDocument();
    expect(screen.getByText(/I denne kategorien har du: 1 feil/i)).toBeInTheDocument();
  });
});