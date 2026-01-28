import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ScoreDashboard } from './ScoreDashboard';

describe('ScoreDashboard', () => {
    const mockScore = {
        overall: 85.5,
        dimensions: [
            { key: 'requirements', name: 'Requirements', score: 90.0, trend: 'UP' as const },
            { key: 'architecture', name: 'Architecture', score: 80.0, trend: 'STABLE' as const },
            { key: 'security', name: 'Security', score: 75.0, trend: 'DOWN' as const },
        ],
        lastUpdated: new Date('2026-01-28T10:00:00Z'),
    };

    const mockOnRefresh = vi.fn();

    beforeEach(() => {
        mockOnRefresh.mockClear();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders overall score correctly', () => {
        render(<ScoreDashboard score={mockScore} />);

        expect(screen.getByText('85.5')).toBeInTheDocument();
        expect(screen.getByText(/overall/i)).toBeInTheDocument();
    });

    it('renders all dimension scores', () => {
        render(<ScoreDashboard score={mockScore} />);

        expect(screen.getByText('Requirements')).toBeInTheDocument();
        expect(screen.getByText('90.0')).toBeInTheDocument();

        expect(screen.getByText('Architecture')).toBeInTheDocument();
        expect(screen.getByText('80.0')).toBeInTheDocument();

        expect(screen.getByText('Security')).toBeInTheDocument();
        expect(screen.getByText('75.0')).toBeInTheDocument();
    });

    it('displays trend indicators correctly', () => {
        render(<ScoreDashboard score={mockScore} />);

        // Check for trend indicators (UP, DOWN, STABLE)
        const upTrends = screen.getAllByTestId('trend-up');
        const downTrends = screen.getAllByTestId('trend-down');
        const stableTrends = screen.getAllByTestId('trend-stable');

        expect(upTrends.length).toBeGreaterThan(0);
        expect(downTrends.length).toBeGreaterThan(0);
        expect(stableTrends.length).toBeGreaterThan(0);
    });

    it('shows last updated timestamp', () => {
        render(<ScoreDashboard score={mockScore} />);

        expect(screen.getByText(/last updated/i)).toBeInTheDocument();
    });

    it('displays loading state when loading prop is true', () => {
        render(<ScoreDashboard score={mockScore} loading={true} />);

        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('calls onRefresh when refresh button clicked', async () => {
        const user = userEvent.setup({ delay: null });
        render(<ScoreDashboard score={mockScore} onRefresh={mockOnRefresh} />);

        const refreshButton = screen.getByRole('button', { name: /refresh/i });
        await user.click(refreshButton);

        expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });

    it('auto-refreshes at specified interval', async () => {
        render(
            <ScoreDashboard
                score={mockScore}
                onRefresh={mockOnRefresh}
                refreshInterval={30000}
            />
        );

        // Fast-forward time by 30 seconds
        vi.advanceTimersByTime(30000);

        await waitFor(() => {
            expect(mockOnRefresh).toHaveBeenCalledTimes(1);
        });

        // Fast-forward another 30 seconds
        vi.advanceTimersByTime(30000);

        await waitFor(() => {
            expect(mockOnRefresh).toHaveBeenCalledTimes(2);
        });
    });

    it('displays circular gauge visualization', () => {
        render(<ScoreDashboard score={mockScore} />);

        const gauge = screen.getByTestId('score-gauge');
        expect(gauge).toBeInTheDocument();
    });

    it('shows different colors for score ranges', () => {
        const highScore = { ...mockScore, overall: 95.0 };
        const mediumScore = { ...mockScore, overall: 75.0 };
        const lowScore = { ...mockScore, overall: 45.0 };

        const { rerender } = render(<ScoreDashboard score={highScore} />);
        expect(screen.getByTestId('score-gauge')).toHaveClass('gauge-green');

        rerender(<ScoreDashboard score={mediumScore} />);
        expect(screen.getByTestId('score-gauge')).toHaveClass('gauge-yellow');

        rerender(<ScoreDashboard score={lowScore} />);
        expect(screen.getByTestId('score-gauge')).toHaveClass('gauge-red');
    });

    it('renders empty state when no score data', () => {
        render(<ScoreDashboard score={null} />);

        expect(screen.getByText(/no score available/i)).toBeInTheDocument();
    });
});
