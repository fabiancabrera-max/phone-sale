'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../frontend/context/AuthContext';
import ProductForm from '../../_components/ProductForm';

export default function NewProductPage() {
  const router = useRouter();
  const { getToken } = useAuth();

  const handleCreate = async (data: any) => {
    const token = await getToken();
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear el producto');
    }

    router.push('/admin/dashboard');
  };

  return <ProductForm title="Nuevo Producto" onSubmit={handleCreate} />;
}
