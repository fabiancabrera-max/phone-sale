import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DashboardPage from '../page';
import { useAuth } from '@/frontend/context/AuthContext';

// Mocking dependencies
jest.mock('@/frontend/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

const mockProducts = [
    {
        id: '1',
        title: 'iPhone 15 Pro',
        description: 'Description 1',
        price: 999,
        images: ['image1.jpg'],
        status: 'on_sale',
        specs: { condition: 'new', storage: '128GB', color: 'Black' }
    },
    {
        id: '2',
        title: 'iPhone 14',
        description: 'Description 2',
        price: 799,
        images: ['image2.jpg'],
        status: 'sold',
        specs: { condition: 'used', storage: '64GB', color: 'Blue' }
    }
];

describe('DashboardPage', () => {
    const mockGetToken = jest.fn().mockResolvedValue('fake-token');

    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({
            getToken: mockGetToken,
        });

        // Mock global fetch
        global.fetch = jest.fn().mockImplementation((url) => {
            if (url.includes('/api/products?')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ success: true, data: { items: mockProducts } }),
                });
            }
            return Promise.reject(new Error('Unknown URL'));
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', async () => {
        render(<DashboardPage />);
        expect(screen.getByText(/Cargando productos/i)).toBeInTheDocument();

        // Cleanup: wait for the initial fetch to complete to avoid act() warnings
        await waitFor(() => {
            expect(screen.queryByText(/Cargando productos/i)).not.toBeInTheDocument();
        });
    });

    it('renders products table after loading', async () => {
        render(<DashboardPage />);

        await waitFor(() => {
            expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
            expect(screen.getByText('iPhone 14')).toBeInTheDocument();
        });
    });

    it('shows empty state when no products are returned', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true, data: { items: [] } }),
            })
        );

        render(<DashboardPage />);

        await waitFor(() => {
            expect(screen.getByText(/No hay productos registrados/i)).toBeInTheDocument();
        });
    });

    it('calls fetchProducts when refresh button is clicked', async () => {
        render(<DashboardPage />);

        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
        });

        const refreshButton = screen.getByRole('button', { name: /actualizar lista/i });
        fireEvent.click(refreshButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(2); // Initial + Refresh
        });

        // Final wait to ensure state updates from second fetch are processed
        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });
    });
});
