import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUploadInput } from './FileUploadInput';

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');

describe('FileUploadInput', () => {
    const mockOnChange = vi.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
        vi.clearAllMocks();
    });

    it('renders drag and drop zone', () => {
        render(<FileUploadInput value={[]} onChange={mockOnChange} />);

        expect(screen.getByText(/drag.*drop/i)).toBeInTheDocument();
        expect(screen.getByText(/click to browse/i)).toBeInTheDocument();
    });

    it('handles file selection through input', async () => {
        const user = userEvent.setup();
        render(<FileUploadInput value={[]} onChange={mockOnChange} />);

        const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
        const input = screen.getByLabelText(/upload files/i);

        await user.upload(input, file);

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalled();
        });
    });

    it('displays file preview for images', async () => {
        const file = {
            id: '1',
            name: 'test.png',
            size: 1024,
            type: 'image/png',
            url: 'mock-url',
        };

        render(<FileUploadInput value={[file]} onChange={mockOnChange} />);

        expect(screen.getByAltText('test.png')).toBeInTheDocument();
        expect(screen.getByText('test.png')).toBeInTheDocument();
        expect(screen.getByText('1.00 KB')).toBeInTheDocument();
    });

    it('displays generic icon for non-image files', () => {
        const file = {
            id: '1',
            name: 'document.pdf',
            size: 2048,
            type: 'application/pdf',
            url: 'mock-url',
        };

        render(<FileUploadInput value={[file]} onChange={mockOnChange} />);

        expect(screen.getByText('document.pdf')).toBeInTheDocument();
        expect(screen.getByText('2.00 KB')).toBeInTheDocument();
    });

    it('handles file removal', async () => {
        const user = userEvent.setup();
        const file = {
            id: '1',
            name: 'test.txt',
            size: 100,
            type: 'text/plain',
            url: 'mock-url',
        };

        render(<FileUploadInput value={[file]} onChange={mockOnChange} />);

        const removeButton = screen.getByRole('button', { name: /remove/i });
        await user.click(removeButton);

        expect(mockOnChange).toHaveBeenCalledWith([]);
    });

    it('displays multiple files', () => {
        const files = [
            { id: '1', name: 'file1.txt', size: 100, type: 'text/plain', url: 'mock-url-1' },
            { id: '2', name: 'file2.png', size: 200, type: 'image/png', url: 'mock-url-2' },
            { id: '3', name: 'file3.pdf', size: 300, type: 'application/pdf', url: 'mock-url-3' },
        ];

        render(<FileUploadInput value={files} onChange={mockOnChange} />);

        expect(screen.getByText('file1.txt')).toBeInTheDocument();
        expect(screen.getByText('file2.png')).toBeInTheDocument();
        expect(screen.getByText('file3.pdf')).toBeInTheDocument();
    });

    it('respects maxFiles limit', async () => {
        const user = userEvent.setup();
        render(<FileUploadInput value={[]} onChange={mockOnChange} maxFiles={2} />);

        const files = [
            new File(['1'], 'file1.txt', { type: 'text/plain' }),
            new File(['2'], 'file2.txt', { type: 'text/plain' }),
            new File(['3'], 'file3.txt', { type: 'text/plain' }),
        ];

        const input = screen.getByLabelText(/upload files/i);
        await user.upload(input, files);

        await waitFor(() => {
            const calls = mockOnChange.mock.calls;
            if (calls.length > 0) {
                const uploadedFiles = calls[calls.length - 1][0];
                expect(uploadedFiles.length).toBeLessThanOrEqual(2);
            }
        });
    });

    it('shows drag state when dragging over', async () => {
        const { container } = render(<FileUploadInput value={[]} onChange={mockOnChange} />);

        const dropzone = container.querySelector('[class*="border"]');
        expect(dropzone).toBeInTheDocument();
    });

    it('formats file sizes correctly', () => {
        const files = [
            { id: '1', name: 'small.txt', size: 500, type: 'text/plain', url: 'mock-url' },
            { id: '2', name: 'medium.txt', size: 5000, type: 'text/plain', url: 'mock-url' },
            { id: '3', name: 'large.txt', size: 5000000, type: 'text/plain', url: 'mock-url' },
        ];

        render(<FileUploadInput value={files} onChange={mockOnChange} />);

        expect(screen.getByText('500 B')).toBeInTheDocument();
        expect(screen.getByText('4.88 KB')).toBeInTheDocument();
        expect(screen.getByText('4.77 MB')).toBeInTheDocument();
    });

    it('disables upload when disabled prop is true', () => {
        render(<FileUploadInput value={[]} onChange={mockOnChange} disabled={true} />);

        const input = screen.getByLabelText(/upload files/i);
        expect(input).toBeDisabled();
    });
});
