import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { BillingPage } from './BillingPage';

// Mock API client
vi.mock('../../lib/api/client', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

const mockSubscriptionData = {
    id: 'sub_123',
    tier: 'PROFESSIONAL',
    status: 'active',
    currentPeriodStart: '2026-01-01',
    currentPeriodEnd: '2026-02-01',
    cancelAtPeriodEnd: false,
    price: 49.99,
};

const mockInvoices = [
    {
        id: 'inv_1',
        number: 'INV-001',
        date: '2026-01-01',
        amount: 49.99,
        status: 'paid',
        pdfUrl: 'https://example.com/invoice1.pdf',
    },
    {
        id: 'inv_2',
        number: 'INV-002',
        date: '2025-12-01',
        amount: 49.99,
        status: 'paid',
        pdfUrl: 'https://example.com/invoice2.pdf',
    },
];

const renderBillingPage = () => {
    return render(
        <BrowserRouter>
            <BillingPage />
        </BrowserRouter>
    );
};

describe('BillingPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(apiClient.get).mockImplementation((url) => {
            if (url.includes('/subscription')) {
                return Promise.resolve({ data: mockSubscriptionData });
            }
            if (url.includes('/invoices')) {
                return Promise.resolve({ data: mockInvoices });
            }
            return Promise.reject(new Error('Unknown endpoint'));
        });
    });

    it('renders billing page heading', async () => {
        renderBillingPage();

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /billing/i })).toBeInTheDocument();
        });
    });

    it('displays current subscription tier', async () => {
        renderBillingPage();

        await waitFor(() => {
            expect(screen.getByText(/professional/i)).toBeInTheDocument();
        });
    });

    it('displays subscription status', async () => {
        renderBillingPage();

        await waitFor(() => {
            expect(screen.getByText(/active/i)).toBeInTheDocument();
        });
    });

    it('displays subscription price', async () => {
        renderBillingPage();

        await waitFor(() => {
            expect(screen.getByText(/\$49\.99/)).toBeInTheDocument();
        });
    });

    it('displays billing cycle dates', async () => {
        renderBillingPage();

        await waitFor(() => {
            expect(screen.getByText(/current period/i)).toBeInTheDocument();
        });
    });

    it('shows upgrade button for non-enterprise tiers', async () => {
        renderBillingPage();

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /upgrade/i })).toBeInTheDocument();
        });
    });

    it('displays invoice history', async () => {
        renderBillingPage();

        await waitFor(() => {
            expect(screen.getByText('INV-001')).toBeInTheDocument();
            expect(screen.getByText('INV-002')).toBeInTheDocument();
        });
    });

    it('shows download button for each invoice', async () => {
        renderBillingPage();

        await waitFor(() => {
            const downloadButtons = screen.getAllByRole('button', { name: /download/i });
            expect(downloadButtons.length).toBeGreaterThanOrEqual(2);
        });
    });

    it('downloads invoice when download button clicked', async () => {
        const user = userEvent.setup();
        global.window.open = vi.fn();

        renderBillingPage();

        await waitFor(() => {
            expect(screen.getByText('INV-001')).toBeInTheDocument();
        });

        const downloadButtons = screen.getAllByRole('button', { name: /download/i });
        await user.click(downloadButtons[0]);

        expect(window.open).toHaveBeenCalledWith('https://example.com/invoice1.pdf', '_blank');
    });

    it('displays cancel subscription button', async () => {
        renderBillingPage();

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /cancel subscription/i })).toBeInTheDocument();
        });
    });

    it('shows confirmation modal when cancel subscription clicked', async () => {
        const user = userEvent.setup();
        renderBillingPage();

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /cancel subscription/i })).toBeInTheDocument();
        });

        const cancelButton = screen.getByRole('button', { name: /cancel subscription/i });
        await user.click(cancelButton);

        expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    });

    it('displays payment method information', async () => {
        renderBillingPage();

        await waitFor(() => {
            expect(screen.getByText(/payment method/i)).toBeInTheDocument();
        });
    });

    it('shows update payment method button', async () => {
        renderBillingPage();

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /update payment/i })).toBeInTheDocument();
        });
    });

    it('displays loading state while fetching data', () => {
        vi.mocked(apiClient.get).mockImplementation(() =>
            new Promise(() => { }) // Never resolves
        );

        renderBillingPage();

        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('displays error message when API call fails', async () => {
        vi.mocked(apiClient.get).mockRejectedValue(new Error('API Error'));

        renderBillingPage();

        await waitFor(() => {
            expect(screen.getByText(/error loading billing/i)).toBeInTheDocument();
        });
    });

    it('shows reactivate button for cancelled subscriptions', async () => {
        vi.mocked(apiClient.get).mockImplementation((url) => {
            if (url.includes('/subscription')) {
                return Promise.resolve({
                    data: { ...mockSubscriptionData, cancelAtPeriodEnd: true, status: 'canceled' }
                });
            }
            return Promise.resolve({ data: [] });
        });

        renderBillingPage();

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /reactivate/i })).toBeInTheDocument();
        });
    });

    it('displays free tier appropriately', async () => {
        vi.mocked(apiClient.get).mockImplementation((url) => {
            if (url.includes('/subscription')) {
                return Promise.resolve({
                    data: { tier: 'FREE', status: 'active' }
                });
            }
            return Promise.resolve({ data: [] });
        });

        renderBillingPage();

        await waitFor(() => {
            expect(screen.getByText(/free/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /upgrade/i })).toBeInTheDocument();
        });
    });
});
