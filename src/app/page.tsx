'use client';

import { Box, Container, Typography } from '@mui/material';
import ProductCarousel from '@/components/ProductCarousel';
import ProductCard from '@/components/ProductCard';
import { getFeaturedProducts, products } from '@/data/products';
import { Smartphone } from '@mui/icons-material';

export default function Home() {
  const featuredProducts = getFeaturedProducts();

  return (
    <Box className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <Box
        className="relative overflow-hidden"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Box className="text-center text-white">
            <Box className="flex justify-center mb-6">
              <Box
                className="bg-white/20 backdrop-blur-sm p-4 rounded-full"
                sx={{ display: 'inline-block' }}
              >
                <Smartphone sx={{ fontSize: 64 }} />
              </Box>
            </Box>
            <Typography
              variant="h1"
              className="font-extrabold mb-4 animate-fade-in"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                textShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}
            >
              Phone Sale
            </Typography>
            <Typography
              variant="h5"
              className="mb-2 font-light"
              sx={{
                fontSize: { xs: '1.25rem', md: '1.75rem' },
                opacity: 0.95,
              }}
            >
              Los Mejores iPhones al Mejor Precio
            </Typography>
            <Typography
              variant="body1"
              className="max-w-2xl mx-auto"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                opacity: 0.9,
              }}
            >
              Encuentra el iPhone perfecto para ti. Garantía incluida y envío
              gratis.
            </Typography>
          </Box>
        </Container>

        {/* Decorative Elements */}
        <Box
          className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          sx={{ transform: 'translate(-50%, -50%)' }}
        />
        <Box
          className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          sx={{ transform: 'translate(50%, 50%)' }}
        />
      </Box>

      {/* Featured Products Carousel */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box className="mb-8 text-center">
          <Typography
            variant="h2"
            className="font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
          >
            Productos Destacados
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            className="max-w-2xl mx-auto"
            sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}
          >
            Descubre nuestra selección premium de iPhones con las mejores
            características y precios
          </Typography>
        </Box>

        <ProductCarousel products={featuredProducts} />
      </Container>

      {/* All Products Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box className="mb-8 text-center">
          <Typography
            variant="h2"
            className="font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
          >
            Todos los Productos
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            className="max-w-2xl mx-auto"
            sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}
          >
            Explora nuestra colección completa de iPhones disponibles
          </Typography>
        </Box>

        <Box
          className="grid gap-6"
          sx={{
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
          }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Box>
      </Container>

      {/* Features Section */}
      <Box className="bg-white py-16">
        <Container maxWidth="lg">
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Garantía Incluida',
                description: 'Todos nuestros productos cuentan con garantía',
                icon: '✓',
              },
              {
                title: 'Envío Gratis',
                description: 'Envío sin costo a todo el país',
                icon: '🚚',
              },
              {
                title: 'Atención Personalizada',
                description: 'Te asesoramos para encontrar tu iPhone ideal',
                icon: '💬',
              },
            ].map((feature, index) => (
              <Box
                key={index}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <Typography variant="h2" className="mb-4">
                  {feature.icon}
                </Typography>
                <Typography variant="h5" className="font-bold mb-2">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box className="bg-gray-900 text-white py-8">
        <Container maxWidth="lg">
          <Typography variant="body2" className="text-center opacity-80">
            © 2024 Phone Sale. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
