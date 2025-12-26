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
  useTheme,
  useMediaQuery,
  Fab,
  Grid2 as Grid,
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

const STATUS_CONFIG: Record<
  ProductStatus,
  {
    label: string;
    color:
      | 'default'
      | 'primary'
      | 'secondary'
      | 'error'
      | 'info'
      | 'success'
      | 'warning';
  }
> = {
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

      const response = await fetch('/api/products?limit=100&status=', {
        // empty status to get all
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
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar "${title}"? Esta acción no se puede deshacer.`
      )
    ) {
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
      <Box
        className={`flex justify-between items-center ${isMobile ? 'mb-4' : 'mb-6'}`}
      >
        <Typography
          variant={isMobile ? 'h4' : 'h4'}
          className={`font-bold text-slate-900 ${isMobile ? 'font-extrabold' : ''}`}
        >
          Productos
        </Typography>
        <Box className="flex items-center gap-2">
          <Tooltip title="Actualizar lista">
            <IconButton
              onClick={() => fetchProducts()}
              className="bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              sx={{ width: 44, height: 44 }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>

          {!isMobile && (
            <Link href="/admin/dashboard/new">
              <Button
                variant="contained"
                startIcon={<Add />}
                className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 py-2.5 px-6 rounded-xl transition-all normal-case font-semibold"
              >
                Nuevo Producto
              </Button>
            </Link>
          )}
        </Box>
      </Box>

      {loading ? (
        <Box className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-[2rem] border border-slate-100">
          <CircularProgress size={48} className="mb-4" />
          <Typography className="text-slate-500 font-medium">
            Cargando productos...
          </Typography>
        </Box>
      ) : products.length === 0 ? (
        <Box className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[2rem] border border-slate-100">
          <Typography className="text-slate-500 font-medium h6 mb-4">
            No hay productos registrados.
          </Typography>
          <Link href="/admin/dashboard/new">
            <Button variant="contained" className="bg-blue-600 rounded-xl px-6">
              Crear el primero
            </Button>
          </Link>
        </Box>
      ) : isMobile ? (
        /* Mobile Cards View */
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid size={{ xs: 12 }} key={product.id}>
              <Paper
                className="p-4 rounded-[1.5rem] border border-slate-100 bg-white/80 backdrop-blur-sm flex gap-4 overflow-hidden relative"
                elevation={0}
                sx={{ boxShadow: '0 4px 15px -3px rgba(0,0,0,0.04)' }}
              >
                <Avatar
                  variant="rounded"
                  src={product.images[0]}
                  alt={product.title}
                  sx={{ width: 80, height: 80 }}
                  className="border border-slate-200 shadow-sm"
                />
                <Box className="flex-1 flex flex-col justify-between min-w-0">
                  <Box className="mb-auto">
                    <Box className="flex justify-between items-start gap-2">
                      <Typography className="font-bold text-slate-900 truncate flex-1 pr-4">
                        {product.title}
                      </Typography>
                      {product.status === 'featured' && (
                        <Star
                          sx={{ fontSize: 18 }}
                          className="text-amber-400"
                        />
                      )}
                    </Box>

                    <Typography
                      variant="caption"
                      className="text-slate-400 line-clamp-2 leading-tight block mt-0.5"
                    >
                      {product.description}
                    </Typography>

                    <Box className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <Typography
                        variant="caption"
                        className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        {formatPrice(product.price)}
                      </Typography>
                      <Chip
                        label={
                          STATUS_CONFIG[product.status]?.label || product.status
                        }
                        color={
                          STATUS_CONFIG[product.status]?.color || 'default'
                        }
                        size="small"
                        className="h-5 text-[10px] font-bold"
                        sx={{ borderRadius: '6px' }}
                      />
                    </Box>
                  </Box>

                  <Box className="flex justify-start gap-2 mt-3">
                    <Link href={`/admin/dashboard/edit/${product.id}`}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Edit sx={{ fontSize: 14 }} />}
                        className="border-blue-100 text-blue-600 bg-blue-50/30 rounded-xl normal-case"
                        sx={{
                          height: 32,
                          fontSize: '0.75rem',
                          px: 2,
                          borderRadius: '12px',
                        }}
                      >
                        Editar
                      </Button>
                    </Link>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      className="border-red-100 text-red-600 bg-red-50/30 rounded-xl normal-case min-w-[36px] p-0"
                      sx={{
                        height: 32,
                        width: 36,
                        minWidth: 36,
                        borderRadius: '12px',
                      }}
                      onClick={() => handleDelete(product.id, product.title)}
                      disabled={deletingId === product.id}
                    >
                      {deletingId === product.id ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <Delete sx={{ fontSize: 16 }} />
                      )}
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        /* Desktop Table View */
        <TableContainer
          component={Paper}
          elevation={0}
          className="border border-slate-100 rounded-[2rem] bg-white/80 backdrop-blur-sm shadow-xl shadow-slate-200/50"
        >
          <Table>
            <TableHead className="bg-slate-50/50">
              <TableRow>
                <TableCell className="font-bold text-slate-500 py-6 pl-8">
                  Imagen
                </TableCell>
                <TableCell className="font-bold text-slate-500 py-6">
                  Producto
                </TableCell>
                <TableCell className="font-bold text-slate-500 py-6">
                  Precio
                </TableCell>
                <TableCell className="font-bold text-slate-500 py-6">
                  Estado
                </TableCell>
                <TableCell className="font-bold text-slate-500 py-6">
                  Specs
                </TableCell>
                <TableCell
                  align="right"
                  className="font-bold text-slate-500 py-6 pr-8"
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.id}
                  hover
                  sx={{ '&:last-child td': { border: 0 } }}
                >
                  <TableCell className="py-4 pl-8">
                    <Avatar
                      variant="rounded"
                      src={product.images[0]}
                      alt={product.title}
                      sx={{ width: 64, height: 64 }}
                      className="border border-slate-100 shadow-sm transition-transform hover:scale-110"
                    />
                  </TableCell>
                  <TableCell className="py-4">
                    <Typography className="font-bold text-slate-900">
                      {product.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-slate-400 block max-w-xs truncate overflow-hidden"
                    >
                      {product.description}
                    </Typography>
                  </TableCell>
                  <TableCell className="py-4">
                    <Typography className="font-heavy text-slate-900">
                      {formatPrice(product.price)}
                    </Typography>
                  </TableCell>
                  <TableCell className="py-4">
                    <Chip
                      label={
                        STATUS_CONFIG[product.status]?.label || product.status
                      }
                      color={STATUS_CONFIG[product.status]?.color || 'default'}
                      size="small"
                      className="font-bold px-1"
                      sx={{ borderRadius: '8px', height: 24 }}
                      icon={
                        product.status === 'featured' ? (
                          <Star fontSize="small" />
                        ) : undefined
                      }
                    />
                  </TableCell>
                  <TableCell className="py-4">
                    <Box className="flex flex-col gap-1">
                      <Typography
                        variant="caption"
                        className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-bold w-fit border border-blue-100/50"
                      >
                        {CONDITION_LABELS[product.specs?.condition] ||
                          product.specs?.condition}
                      </Typography>
                      <Typography
                        variant="caption"
                        className="text-slate-500 font-medium pl-1"
                      >
                        {product.specs?.storage} • {product.specs?.color}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right" className="py-4 pr-8">
                    <Box className="flex justify-end gap-2">
                      <Tooltip title="Editar">
                        <Link href={`/admin/dashboard/edit/${product.id}`}>
                          <IconButton
                            size="small"
                            className="text-blue-600 bg-blue-50/50 hover:bg-blue-100 transition-all"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Link>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          className="text-red-600 bg-red-50/50 hover:bg-red-100 transition-all"
                          onClick={() =>
                            handleDelete(product.id, product.title)
                          }
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Mobile FAB for New Product */}
      {isMobile && (
        <Link href="/admin/dashboard/new">
          <Fab
            aria-label="add"
            sx={{
              position: 'fixed',
              bottom: 60,
              right: 24,
              bgcolor: '#3b82f6', // blue-500
              color: 'white',
              '&:hover': {
                bgcolor: '#2563eb', // blue-600
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: '0 8px 30px -5px rgba(59, 130, 246, 0.5)',
              width: 60,
              height: 60,
            }}
          >
            <Add sx={{ fontSize: 32 }} />
          </Fab>
        </Link>
      )}
    </Box>
  );
}
