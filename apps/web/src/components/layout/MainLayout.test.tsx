import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { MainLayout } from './MainLayout';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
        useLocation: () => ({ pathname: '/dashboard' }),
    };
});

// Mock auth context
vi.mock('../../contexts/AuthContext', () => ({
    useAuth: () => ({
        user: {
            id: 'user-1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'USER',
        },
        logout: vi.fn(),
    }),
}));

const renderMainLayout = (children = <div>Test Content</div>) => {
    return render(
        <BrowserRouter>
            <MainLayout>{children}</MainLayout>
        </BrowserRouter>
    );
};

describe('MainLayout', () => {
    beforeEach(() => {
        // Reset viewport to desktop size
        global.innerWidth = 1024;
        global.innerHeight = 768;
    });

    it('renders children content', () => {
        renderMainLayout(<div>Custom Content</div>);
        expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });

    it('displays navigation menu', () => {
        renderMainLayout();

        expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /questionnaires/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /billing/i })).toBeInTheDocument();
    });

    it('displays user profile information', () => {
        renderMainLayout();

        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('shows mobile menu toggle button on small screens', () => {
        global.innerWidth = 375;
        global.dispatchEvent(new Event('resize'));

        renderMainLayout();

        const menuToggle = screen.getByRole('button', { name: /menu/i });
        expect(menuToggle).toBeInTheDocument();
    });

    it('toggles sidebar on mobile menu button click', async () => {
        const user = userEvent.setup();
        global.innerWidth = 375;
        global.dispatchEvent(new Event('resize'));

        renderMainLayout();

        const menuToggle = screen.getByRole('button', { name: /menu/i });

        // Sidebar should be hidden initially on mobile
        const sidebar = screen.getByRole('navigation');
        expect(sidebar).toHaveClass('hidden');

        // Click to open
        await user.click(menuToggle);
        expect(sidebar).not.toHaveClass('hidden');

        // Click to close
        await user.click(menuToggle);
        expect(sidebar).toHaveClass('hidden');
    });

    it('highlights active navigation link', () => {
        renderMainLayout();

        const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
        expect(dashboardLink).toHaveClass('active');
    });

    it('displays logout button', () => {
        renderMainLayout();

        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    it('calls logout handler when logout button clicked', async () => {
        const user = userEvent.setup();
        const mockLogout = vi.fn();

        vi.mocked(useAuth).mockReturnValue({
            user: {
                id: 'user-1',
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
                role: 'USER',
            },
            logout: mockLogout,
        });

        renderMainLayout();

        const logoutButton = screen.getByRole('button', { name: /logout/i });
        await user.click(logoutButton);

        expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('renders header with logo', () => {
        renderMainLayout();

        expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    });

    it('is responsive on different screen sizes', () => {
        const { rerender } = renderMainLayout();

        // Desktop
        global.innerWidth = 1920;
        global.dispatchEvent(new Event('resize'));
        rerender(
            <BrowserRouter>
                <MainLayout><div>Content</div></MainLayout>
            </BrowserRouter>
        );
        expect(screen.getByRole('navigation')).toBeVisible();

        // Tablet
        global.innerWidth = 768;
        global.dispatchEvent(new Event('resize'));
        rerender(
            <BrowserRouter>
                <MainLayout><div>Content</div></MainLayout>
            </BrowserRouter>
        );

        // Mobile
        global.innerWidth = 375;
        global.dispatchEvent(new Event('resize'));
        rerender(
            <BrowserRouter>
                <MainLayout><div>Content</div></MainLayout>
            </BrowserRouter>
        );
    });

    it('sidebar is collapsible', async () => {
        const user = userEvent.setup();
        renderMainLayout();

        const collapseButton = screen.getByRole('button', { name: /collapse/i });
        const sidebar = screen.getByRole('navigation');

        await user.click(collapseButton);
        expect(sidebar).toHaveClass('collapsed');

        await user.click(collapseButton);
        expect(sidebar).not.toHaveClass('collapsed');
    });

    it('displays notifications bell icon', () => {
        renderMainLayout();

        expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument();
    });

    it('shows notification badge when unread notifications exist', () => {
        renderMainLayout();

        const notificationBadge = screen.getByTestId('notification-badge');
        expect(notificationBadge).toBeInTheDocument();
        expect(notificationBadge).toHaveTextContent('3');
    });
});
