'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/frontend/context/AuthContext';
import ProductForm from '@/app/admin/_components/ProductForm';
import { Product } from '@/frontend/types/product';
import { Box, CircularProgress, Alert } from '@mui/material';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const { getToken } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const productId = params.id as string;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = await getToken();
                // Allow public endpoint initially, but auth is better for admin actions
                const response = await fetch(`/api/products/${productId}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                if (!response.ok) {
                    throw new Error('No se pudo cargar el producto');
                }

                const result = await response.json();
                setProduct(result.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId, getToken]);

    const handleUpdate = async (data: any) => {
        const token = await getToken();
        const response = await fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al actualizar el producto');
        }

        router.push('/admin/dashboard');
    };

    if (loading) {
        return (
            <Box className="flex justify-center items-center py-20">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !product) {
        return (
            <Alert severity="error">
                {error || 'Producto no encontrado'}
            </Alert>
        );
    }

    return (
        <ProductForm
            title="Editar Producto"
            initialData={product}
            onSubmit={handleUpdate}
        />
    );
}
