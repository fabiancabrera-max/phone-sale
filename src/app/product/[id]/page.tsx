'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Chip,
  Breadcrumbs,
  Link,
  Paper,
} from '@mui/material';
import { ArrowBack, Home } from '@mui/icons-material';
import ImageGallery from '@/components/ImageGallery';
import ContactButtons from '@/components/ContactButtons';
import { getProductById } from '@/data/products';

import { formatPrice } from '@/utils/formatters';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const product = getProductById(productId);

  if (!product) {
    return (
      <Container maxWidth="lg" className="py-16 text-center">
        <Typography variant="h4" className="mb-4">
          Producto no encontrado
        </Typography>
        <Link href="/" className="text-blue-600 hover:underline">
          Volver al inicio
        </Link>
      </Container>
    );
  }

  return (
    <Box className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        {/* Breadcrumbs & Back Navigation */}
        <Box className="flex items-center justify-between mb-6">
          <Breadcrumbs>
            <Link
              href="/"
              className="flex items-center gap-1 text-gray-600 hover:text-slate-900 transition-colors"
            >
              <Home fontSize="small" />
              Inicio
            </Link>
            <Typography color="text.primary" className="font-semibold">
              {product.title}
            </Typography>
          </Breadcrumbs>

          {/* Back Arrow Button */}
          <Link
            onClick={() => router.back()}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white cursor-pointer transition-all duration-300"
            sx={{
              '&:hover': {
                transform: 'translateX(-4px)',
              },
            }}
          >
            <ArrowBack fontSize="small" />
          </Link>
        </Box>

        {/* Product Content */}
        <Paper
          elevation={0}
          className="rounded-3xl overflow-hidden border border-gray-200"
          sx={{ background: 'white' }}
        >
          <Box
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            sx={{ p: { xs: 4, md: 6 } }}
          >
            {/* Image Gallery */}
            <Box>
              <ImageGallery images={product.images} title={product.title} />
            </Box>

            {/* Product Info */}
            <Box className="flex flex-col gap-6">
              <Box>
                {product.featured && (
                  <Chip
                    label="Destacado"
                    className="mb-4"
                    sx={{
                      background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                )}
                <Typography
                  variant="h3"
                  className="font-bold mb-4"
                  sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}
                >
                  {product.title}
                </Typography>
                <Typography
                  variant="h4"
                  className="font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                  {formatPrice(product.price)}
                </Typography>
              </Box>

              {/* Specifications */}
              {product.specs && (
                <Box className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200">
                  <Typography
                    variant="h6"
                    className="font-bold mb-4 text-gray-900"
                  >
                    Especificaciones
                  </Typography>
                  <Box className="space-y-3">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <Box
                        key={key}
                        className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0"
                      >
                        <Typography
                          variant="body2"
                          className="font-semibold text-gray-600 capitalize"
                        >
                          {key === 'storage'
                            ? 'Almacenamiento'
                            : key === 'color'
                              ? 'Color'
                              : key === 'condition'
                                ? 'Condición'
                                : key}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="font-bold text-gray-900"
                        >
                          {value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Description */}
              <Box>
                <Typography
                  variant="h6"
                  className="font-bold mb-3 text-gray-900"
                >
                  Descripción
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  className="leading-relaxed"
                  sx={{ lineHeight: 1.8 }}
                >
                  {product.description}
                </Typography>
              </Box>

              {/* Contact Buttons */}
              <Box className="pt-4">
                <Typography
                  variant="h6"
                  className="pb-2 font-bold mb-4 text-gray-900"
                >
                  Si te interesa este producto puedes contactarme por:
                </Typography>
                <ContactButtons product={product} />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
