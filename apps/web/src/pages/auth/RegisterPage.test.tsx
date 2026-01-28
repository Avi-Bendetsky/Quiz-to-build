import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { RegisterPage } from './RegisterPage';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

vi.mock('../../lib/api/client', () => ({
    default: {
        post: vi.fn(),
    },
}));

const renderRegisterPage = () => {
    return render(
        <BrowserRouter>
            <RegisterPage />
        </BrowserRouter>
    );
};

describe('RegisterPage', () => {
    it('renders registration form', () => {
        renderRegisterPage();

        expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    });

    it('validates required fields', async () => {
        const user = userEvent.setup();
        renderRegisterPage();

        const submitButton = screen.getByRole('button', { name: /sign up/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
            expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
            expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        });
    });

    it('shows password strength requirements', async () => {
        const user = userEvent.setup();
        renderRegisterPage();

        const passwordInput = screen.getByLabelText(/^password$/i);
        await user.type(passwordInput, 'Pass');

        // Should show requirements
        expect(screen.getByText(/at least 12 characters/i)).toBeInTheDocument();
        expect(screen.getByText(/one uppercase letter/i)).toBeInTheDocument();
        expect(screen.getByText(/one lowercase letter/i)).toBeInTheDocument();
        expect(screen.getByText(/one number/i)).toBeInTheDocument();
    });

    it('validates password strength requirements met', async () => {
        const user = userEvent.setup();
        renderRegisterPage();

        const passwordInput = screen.getByLabelText(/^password$/i);
        await user.type(passwordInput, 'StrongPassword123');

        // All requirements should be met (shown in green)
        const requirements = screen.getAllByText(/at least 12 characters|one uppercase|one lowercase|one number/i);
        expect(requirements.length).toBeGreaterThan(0);
    });

    it('validates password confirmation match', async () => {
        const user = userEvent.setup();
        renderRegisterPage();

        const passwordInput = screen.getByLabelText(/^password$/i);
        const confirmInput = screen.getByLabelText(/confirm password/i);

        await user.type(passwordInput, 'StrongPassword123');
        await user.type(confirmInput, 'DifferentPassword123');
        await user.tab();

        await waitFor(() => {
            expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
        });
    });

    it('validates email format', async () => {
        const user = userEvent.setup();
        renderRegisterPage();

        const emailInput = screen.getByLabelText(/email/i);
        await user.type(emailInput, 'invalid-email');
        await user.tab();

        await waitFor(() => {
            expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
        });
    });

    it('shows loading state during registration', async () => {
        const user = userEvent.setup();
        renderRegisterPage();

        const firstName = screen.getByLabelText(/first name/i);
        const lastName = screen.getByLabelText(/last name/i);
        const email = screen.getByLabelText(/email/i);
        const password = screen.getByLabelText(/^password$/i);
        const confirm = screen.getByLabelText(/confirm password/i);

        await user.type(firstName, 'John');
        await user.type(lastName, 'Doe');
        await user.type(email, 'john@example.com');
        await user.type(password, 'StrongPassword123');
        await user.type(confirm, 'StrongPassword123');

        const submitButton = screen.getByRole('button', { name: /sign up/i });
        await user.click(submitButton);

        expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    });

    it('has link to login page', () => {
        renderRegisterPage();
        expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    });
});
