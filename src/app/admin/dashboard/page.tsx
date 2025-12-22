'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/frontend/context/AuthContext';
import { Product, ProductStatus } from '@/frontend/types/product';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    IconButton,
    Avatar,
    Tooltip,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    Refresh,
    Star,
    CheckCircle,
    Block,
} from '@mui/icons-material';
import { formatPrice } from '@/frontend/utils/formatters';

const STATUS_CONFIG: Record<ProductStatus, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
    featured: { label: 'Destacado', color: 'secondary' },
    on_sale: { label: 'En Venta', color: 'success' },
    sold: { label: 'Vendido', color: 'default' },
};

const CONDITION_LABELS: Record<string, string> = {
    new: 'Nuevo',
    used_as_new: 'Como Nuevo',
    used: 'Usado',
    refurbished: 'Reparado',
};

export default function DashboardPage() {
    const { getToken } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = await getToken();
            if (!token) return;

            const response = await fetch('/api/products?limit=100&status=', { // empty status to get all
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al cargar productos');
            }

            const result = await response.json();
            if (result.success) {
                setProducts(result.data.items);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [getToken]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`¿Estás seguro de que quieres eliminar "${title}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            setDeletingId(id);
            const token = await getToken();
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al eliminar');
            }

            // Optimistic update
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            alert('Error al eliminar el producto');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <Box>
            <Box className="flex justify-between items-center mb-8">
                <Typography variant="h4" className="font-bold text-slate-800">
                    Productos
                </Typography>
                <Box className="flex gap-2">
                    <Button
                        startIcon={<Refresh />}
                        onClick={() => fetchProducts()}
                        variant="outlined"
                        className="border-slate-300 text-slate-600"
                    >
                        Actualizar
                    </Button>
                    <Link href="/admin/dashboard/new">
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Nuevo Producto
                        </Button>
                    </Link>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" className="mb-4">
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper} elevation={0} className="border border-slate-200 rounded-xl overflow-hidden">
                <Table>
                    <TableHead className="bg-slate-50">
                        <TableRow>
                            <TableCell className="font-bold text-slate-500">Imagen</TableCell>
                            <TableCell className="font-bold text-slate-500">Producto</TableCell>
                            <TableCell className="font-bold text-slate-500">Precio</TableCell>
                            <TableCell className="font-bold text-slate-500">Estado</TableCell>
                            <TableCell className="font-bold text-slate-500">Specs</TableCell>
                            <TableCell align="right" className="font-bold text-slate-500">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" className="py-12">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" className="py-12 text-slate-500">
                                    No hay productos registrados. ¡Crea el primero!
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id} hover>
                                    <TableCell>
                                        <Avatar
                                            variant="rounded"
                                            src={product.images[0]}
                                            alt={product.title}
                                            sx={{ width: 56, height: 56 }}
                                            className="border border-slate-200"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography className="font-semibold text-slate-800">
                                            {product.title}
                                        </Typography>
                                        <Typography variant="caption" className="text-slate-500 block max-w-xs truncate">
                                            {product.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className="font-medium">
                                            {formatPrice(product.price)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={STATUS_CONFIG[product.status]?.label || product.status}
                                            color={STATUS_CONFIG[product.status]?.color || 'default'}
                                            size="small"
                                            className="font-semibold"
                                            icon={product.status === 'featured' ? <Star fontSize="small" /> : undefined}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box className="flex flex-col gap-1">
                                            <Typography variant="caption" className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full inline-block w-fit">
                                                {CONDITION_LABELS[product.specs?.condition] || product.specs?.condition}
                                            </Typography>
                                            <Typography variant="caption" className="text-slate-500">
                                                {product.specs?.storage} • {product.specs?.color}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box className="flex justify-end gap-1">
                                            <Tooltip title="Editar">
                                                <Link href={`/admin/dashboard/edit/${product.id}`}>
                                                    <IconButton size="small" className="text-blue-600 bg-blue-50 hover:bg-blue-100">
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                </Link>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <IconButton
                                                    size="small"
                                                    className="text-red-600 bg-red-50 hover:bg-red-100"
                                                    onClick={() => handleDelete(product.id, product.title)}
                                                    disabled={deletingId === product.id}
                                                >
                                                    {deletingId === product.id ? (
                                                        <CircularProgress size={20} color="inherit" />
                                                    ) : (
                                                        <Delete fontSize="small" />
                                                    )}
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
