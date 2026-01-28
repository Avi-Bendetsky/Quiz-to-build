import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

// Mock API client
vi.mock('../../lib/api/client', () => ({
    default: {
        post: vi.fn(),
    },
}));

const renderLoginPage = () => {
    return render(
        <BrowserRouter>
            <LoginPage />
        </BrowserRouter>
    );
};

describe('LoginPage', () => {
    it('renders login form', () => {
        renderLoginPage();

        expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('validates required fields', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        const submitButton = screen.getByRole('button', { name: /sign in/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/email is required/i)).toBeInTheDocument();
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        });
    });

    it('validates email format', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        const emailInput = screen.getByLabelText(/email/i);
        await user.type(emailInput, 'invalid-email');
        await user.tab();

        await waitFor(() => {
            expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
        });
    });

    it('validates password minimum length', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        const passwordInput = screen.getByLabelText(/password/i);
        await user.type(passwordInput, '123');
        await user.tab();

        await waitFor(() => {
            expect(screen.getByText(/password must be at least/i)).toBeInTheDocument();
        });
    });

    it('shows loading state during submission', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    });

    it('displays error message on failed login', async () => {
        const user = userEvent.setup();
        const { default: apiClient } = await import('../../lib/api/client');
        vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Invalid credentials'));

        renderLoginPage();

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'wrongpassword');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/failed to login/i)).toBeInTheDocument();
        });
    });

    it('has link to register page', () => {
        renderLoginPage();
        expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    });

    it('has link to forgot password', () => {
        renderLoginPage();
        expect(screen.getByRole('link', { name: /forgot password/i })).toBeInTheDocument();
    });
});
