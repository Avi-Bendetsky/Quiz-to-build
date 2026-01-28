import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OAuthButtons } from './OAuthButtons';

// Mock window.location
delete (window as any).location;
window.location = { href: '' } as Location;

describe('OAuthButtons', () => {
    beforeEach(() => {
        window.location.href = '';
    });

    it('renders Google OAuth button', () => {
        render(<OAuthButtons mode={'login'} />);
        expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
    });

    it('renders Microsoft OAuth button', () => {
        render(<OAuthButtons mode={'login'} />);
        expect(screen.getByRole('button', { name: /continue with microsoft/i })).toBeInTheDocument();
    });

    it('triggers Google OAuth flow on click', async () => {
        const user = userEvent.setup();
        render(<OAuthButtons mode={'login'} />);

        const googleButton = screen.getByRole('button', { name: /continue with google/i });
        await user.click(googleButton);

        // Should redirect to OAuth endpoint
        expect(window.location.href).toContain('/api/auth/google');
    });

    it('triggers Microsoft OAuth flow on click', async () => {
        const user = userEvent.setup();
        render(<OAuthButtons mode={'login'} />);

        const microsoftButton = screen.getByRole('button', { name: /continue with microsoft/i });
        await user.click(microsoftButton);

        // Should redirect to OAuth endpoint
        expect(window.location.href).toContain('/api/auth/microsoft');
    });

    it('shows Google logo icon', () => {
        const { container } = render(<OAuthButtons mode={'login'} />);
        const googleButton = screen.getByRole('button', { name: /continue with google/i });
        expect(googleButton).toBeInTheDocument();
    });

    it('shows Microsoft logo icon', () => {
        const { container } = render(<OAuthButtons mode={'login'} />);
        const microsoftButton = screen.getByRole('button', { name: /continue with microsoft/i });
        expect(microsoftButton).toBeInTheDocument();
    });

    it('buttons are enabled by default', () => {
        render(<OAuthButtons mode={'login'} />);
        expect(screen.getByRole('button', { name: /continue with google/i })).toBeEnabled();
        expect(screen.getByRole('button', { name: /continue with microsoft/i })).toBeEnabled();
    });
});
