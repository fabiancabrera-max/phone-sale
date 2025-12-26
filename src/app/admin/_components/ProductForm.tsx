'use client';

import React, { useState } from 'react';
import {
    Box,
    Button,
    Grid2 as Grid,
    Paper,
    TextField,
    Typography,
    MenuItem,
    IconButton,
    CircularProgress,
    Alert,
    InputAdornment,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    CloudUpload,
    Delete,
    Save,
    ArrowBack,
    Image as ImageIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/frontend/context/AuthContext';
import { Product, ProductStatus } from '@/frontend/types/product';

interface ProductFormProps {
    initialData?: Product;
    onSubmit: (data: any) => Promise<void>;
    title: string;
}

const CONDITIONS = [
    { value: 'new', label: 'Nuevo' },
    { value: 'used_as_new', label: 'Usado - Como Nuevo' },
    { value: 'used', label: 'Usado - Buen Estado' },
    { value: 'refurbished', label: 'Reparado / Refurbished' },
];

const STATUSES = [
    { value: 'on_sale', label: 'En Venta' },
    { value: 'featured', label: 'Destacado' },
    { value: 'sold', label: 'Vendido' },
];

export default function ProductForm({ initialData, onSubmit, title }: ProductFormProps) {
    const router = useRouter();
    const { getToken } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [tempId] = useState(() => initialData?.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `temp_${Date.now()}`));

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        status: initialData?.status || 'on_sale',
        specs: {
            condition: initialData?.specs?.condition || 'new',
            color: initialData?.specs?.color || '',
            storage: initialData?.specs?.storage || '',
        },
    });

    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            specs: { ...prev.specs, [name]: value },
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (images.length + files.length > 5) {
            setError('Máximo 5 imágenes por producto');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const token = await getToken();
            const uploadedUrls: string[] = [];
            const targetProductId = initialData?.id || tempId;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('image', file);
                formData.append('productId', targetProductId);

                const response = await fetch('/api/products/upload-image', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al subir imagen');
                }

                const data = await response.json();
                if (data.success) {
                    uploadedUrls.push(data.data.url);
                }
            }

            setImages((prev) => [...prev, ...uploadedUrls]);
        } catch (err: any) {
            setError(err.message || 'Error al subir las imágenes');
        } finally {
            setUploading(false);
            // Reset input value to allow uploading same file again
            e.target.value = '';
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (images.length === 0) {
            setError('Debes subir al menos una imagen');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            // Prepare data
            const payload = {
                ...formData,
                price: Number(formData.price),
                images: images,
                // Pass the ID if it's a new product so the backend uses it
                id: !initialData ? tempId : undefined,
            };

            await onSubmit(payload);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error al guardar el producto');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            {/* Header Section */}
            <Box
                className="flex items-center justify-between mb-4"
                sx={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 2
                }}
            >
                <Typography
                    variant={isMobile ? "h4" : "h5"}
                    className={`font-bold text-slate-900 ${isMobile ? 'font-extrabold' : ''}`}
                >
                    {title}
                </Typography>

                <Box className="flex items-center gap-2">
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => router.back()}
                        className="text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-xl transition-all"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            // On desktop it stays first, on mobile it goes to the right? 
                            // Actually, let's just reverse the order in the DOM or use order property
                            order: isMobile ? 1 : -1
                        }}
                    >
                        Volver
                    </Button>

                    {!isMobile && (
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={submitting || uploading}
                            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                            className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 py-2.5 px-6 rounded-xl transition-all normal-case"
                            sx={{ fontWeight: 600 }}
                        >
                            {submitting ? 'Guardando...' : 'Guardar Producto'}
                        </Button>
                    )}
                </Box>
            </Box>

            {error && (
                <Alert severity="error" className="mb-6">
                    {error}
                </Alert>
            )}

            <Grid container spacing={4}>
                {/* Left Column: Basic Info */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper
                        className="p-6 md:p-8 rounded-[2rem] border border-slate-100 bg-white/80 backdrop-blur-sm"
                        elevation={0}
                        sx={{ boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)' }}
                    >
                        <Typography variant="h6" className="pb-2 font-bold text-slate-800">
                            Información Básica
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Título del Producto"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    helperText="Ej: iPhone 15 Pro Max 256GB"
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Descripción"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    multiline
                                    rows={4}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Precio"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Estado de Publicación"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {STATUSES.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper
                        className="p-6 md:p-8 mt-8 rounded-[2rem] border border-slate-100 bg-white/80 backdrop-blur-sm"
                        elevation={0}
                        sx={{ boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)' }}
                    >
                        <Typography variant="h6" className="pb-4 font-bold text-slate-800">
                            Especificaciones
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Condición"
                                    name="condition"
                                    value={formData.specs.condition}
                                    onChange={handleSpecChange}
                                    required
                                >
                                    {CONDITIONS.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Color"
                                    name="color"
                                    value={formData.specs.color}
                                    onChange={handleSpecChange}
                                    required
                                    placeholder="Ej: Titanio Natural"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Almacenamiento"
                                    name="storage"
                                    value={formData.specs.storage}
                                    onChange={handleSpecChange}
                                    required
                                    placeholder="Ej: 256GB"
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Right Column: Images */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        className="p-6 md:p-8 rounded-[2rem] border border-slate-100 bg-white/80 backdrop-blur-sm sticky top-6"
                        elevation={0}
                        sx={{ boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)' }}
                    >
                        <Typography variant="h6" className="mb-4 font-bold text-slate-800">
                            Imágenes ({images.length}/5)
                        </Typography>

                        <Box className="grid grid-cols-2 gap-2 mb-4">
                            {images.map((url, index) => (
                                <Box
                                    key={index}
                                    className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group"
                                >
                                    <img
                                        src={url}
                                        alt={`Preview ${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <Box className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <IconButton
                                            size="small"
                                            onClick={() => removeImage(index)}
                                            className="bg-white hover:bg-red-50 text-red-600"
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))}

                            {images.length < 5 && (
                                <Button
                                    component="label"
                                    className="aspect-square rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 flex flex-col items-center justify-center text-slate-500 hover:text-blue-600 transition-all"
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        <>
                                            <CloudUpload fontSize="large" className="mb-1" />
                                            <Typography variant="caption" className="font-semibold">
                                                Subir
                                            </Typography>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        accept="image/png, image/jpeg, image/webp"
                                        onChange={handleImageUpload}
                                    />
                                </Button>
                            )}
                        </Box>

                        <Alert severity="info" className="text-xs">
                            <Typography variant="caption">
                                Formatos: JPG, PNG, WEBP.
                                <br />
                                Máx 5MB por imagen.
                            </Typography>
                        </Alert>
                    </Paper>
                </Grid>
            </Grid>

            {/* Sticky Bottom Action Bar for Mobile */}
            {isMobile && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 2.5,
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(16px)',
                        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                        zIndex: 1000,
                        display: 'flex',
                        gap: 2,
                        boxShadow: '0 -10px 25px -5px rgba(0,0,0,0.1)'
                    }}
                >
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => router.back()}
                        className="border-slate-200 text-slate-600 rounded-2xl normal-case py-3"
                        sx={{ fontWeight: 600 }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={submitting || uploading}
                        startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                        className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 rounded-2xl normal-case py-3"
                        sx={{ fontWeight: 600 }}
                    >
                        {submitting ? 'Guardando...' : 'Guardar'}
                    </Button>
                </Box>
            )}

            {/* Spacer for sticky bar */}
            {isMobile && <Box sx={{ height: 100 }} />}
        </Box>
    );
}
