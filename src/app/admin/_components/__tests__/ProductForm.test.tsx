import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductForm from '../ProductForm';
import { useAuth } from '@/frontend/context/AuthContext';
import { useRouter } from 'next/navigation';

// Mocking dependencies
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/frontend/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

const mockPush = jest.fn();
const mockGetToken = jest.fn().mockResolvedValue('fake-token');

(useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
});

(useAuth as jest.Mock).mockReturnValue({
    getToken: mockGetToken,
});

const mockProduct = {
    id: '1',
    title: 'iPhone 15 Pro',
    description: 'The best iPhone ever',
    price: 999,
    images: ['https://example.com/image.jpg'],
    status: 'featured' as const,
    specs: {
        condition: 'new' as const,
        storage: '128GB',
        color: 'Natural Titanium',
    },
};

describe('ProductForm', () => {
    it('renders the form with title', () => {
        render(<ProductForm title="Nuevo Producto" onSubmit={jest.fn()} />);
        expect(screen.getByText('Nuevo Producto')).toBeInTheDocument();
    });

    it('renders with initial data', () => {
        render(
            <ProductForm
                title="Editar Producto"
                initialData={mockProduct}
                onSubmit={jest.fn()}
            />
        );

        expect(screen.getByDisplayValue('iPhone 15 Pro')).toBeInTheDocument();
        expect(screen.getByDisplayValue('999')).toBeInTheDocument();
        expect(screen.getByDisplayValue('The best iPhone ever')).toBeInTheDocument();
    });

    it('calls onSubmit when the form is submitted', async () => {
        const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
        render(
            <ProductForm
                title="Nuevo Producto"
                onSubmit={mockOnSubmit}
                initialData={mockProduct}
            />
        );

        // Fill form
        fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'iPhone 14' } });
        fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: 'Buen estado' } });
        fireEvent.change(screen.getByLabelText(/Precio/i), { target: { value: '800' } });

        // Submit
        const saveButton = screen.getAllByText(/Guardar/i)[0]; // There might be more than one due to mobile view
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled();
        });
    });
});
