import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductCard from '../ProductCard';
import { Product } from '@/frontend/types/product';

const mockProduct: Product = {
    id: '1',
    title: 'iPhone 15 Pro',
    description: 'The latest iPhone',
    price: 999,
    images: ['/test-image.jpg'],
    status: 'on_sale',
    specs: {
        condition: 'new',
        color: 'Titanium',
        storage: '128GB',
    },
};

describe('ProductCard', () => {
    it('renders product information correctly', () => {
        render(<ProductCard product={mockProduct} />);

        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
        expect(screen.getByText(/999/)).toBeInTheDocument();
    });

    it('shows "Vendido" chip when status is sold', () => {
        const soldProduct = { ...mockProduct, status: 'sold' as const };
        render(<ProductCard product={soldProduct} />);

        expect(screen.getByText('Vendido')).toBeInTheDocument();
    });

    it('shows "Destacado" chip when status is featured', () => {
        const featuredProduct = { ...mockProduct, status: 'featured' as const };
        render(<ProductCard product={featuredProduct} />);

        expect(screen.getByText('Destacado')).toBeInTheDocument();
    });

    it('does not show any status chip when status is on_sale', () => {
        render(<ProductCard product={mockProduct} />);

        expect(screen.queryByText('Vendido')).not.toBeInTheDocument();
        expect(screen.queryByText('Destacado')).not.toBeInTheDocument();
    });
});
