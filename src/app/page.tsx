import { Box, Container, Typography, Paper } from '@mui/material';
import ProductCarousel from '@/frontend/components/ProductCarousel';
import ProductCard from '@/frontend/components/ProductCard';
import DebugLogger from '@/frontend/components/DebugLogger';

import { getFeaturedProducts, getProducts } from '@/backend/lib/products';
import { Product as BackendProduct } from '@/backend/types';
import { Product as FrontendProduct } from '@/frontend/types/product';
import { Smartphone, LocationOn } from '@mui/icons-material';
import siteContent from '@/config/siteContent.json';

const serializeProduct = (product: BackendProduct): FrontendProduct => ({
  id: product.id,
  title: product.title,
  description: product.description,
  price: product.price,
  images: product.images,
  status: product.status,
  specs: product.specs,
});

export default async function Home() {
  let featuredProducts: FrontendProduct[] = [];
  let allProducts: FrontendProduct[] = [];

  try {
    // Fetch real data from Backend
    const rawFeatured = await getFeaturedProducts().catch(() => []);
    const { items: rawProducts } = await getProducts(100).catch(() => ({
      items: [],
    }));

    featuredProducts = (rawFeatured || []).map(serializeProduct);
    allProducts = (rawProducts || []).map(serializeProduct);
  } catch (error) {
    console.error('Error fetching products for Home:', error);
    // Fallback to empty arrays so the build continues
  }

  return (
    <Box className="min-h-screen bg-slate-50">
      <DebugLogger label="Featured Products" data={featuredProducts} />
      <DebugLogger label="All Products (On Sale)" data={allProducts} />

      {/* Hero Section */}
      <Box
        className="relative overflow-hidden"
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', // Slate dark gradient
          py: { xs: 6, md: 8 }, // Reduced padding
        }}
      >
        <Container maxWidth="lg">
          <Box className="text-center text-white">
            <Box className="flex justify-center mb-4">
              <Box
                className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10"
                sx={{ display: 'inline-block' }}
              >
                <Smartphone sx={{ fontSize: 40 }} /> {/* Reduced icon size */}
              </Box>
            </Box>
            <Typography
              variant="h1"
              className="font-extrabold mb-3 animate-fade-in tracking-tight"
              sx={{
                fontSize: { xs: '2rem', md: '3.5rem' }, // Reduced font size
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              {siteContent.hero.title}
            </Typography>
            <Typography
              variant="h5"
              className="mb-2 font-medium text-slate-200"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.5rem' },
                opacity: 0.95,
              }}
            >
              {siteContent.hero.subtitle}
            </Typography>
            <Typography
              variant="body1"
              className="max-w-xl mx-auto text-slate-300"
              sx={{
                fontSize: { xs: '0.9rem', md: '1rem' },
                margin: '0 auto',
              }}
            >
              {siteContent.hero.description}
            </Typography>
          </Box>
        </Container>

        {/* Decorative Elements - More subtle */}
        <Box
          className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
          sx={{ transform: 'translate(-50%, -50%)' }}
        />
        <Box
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          sx={{ transform: 'translate(50%, 50%)' }}
        />
      </Box>

      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Box className="mb-8 text-center">
            <Typography
              variant="h2"
              className="font-bold mb-3 text-slate-900 tracking-tight"
              sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
            >
              {siteContent.featured.title}
            </Typography>
            <Typography
              variant="body1"
              className="max-w-2xl mx-auto text-slate-600"
              sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}
            >
              {siteContent.featured.description}
            </Typography>
          </Box>

          <ProductCarousel products={featuredProducts} />
        </Container>
      )}

      {/* All Products Grid */}
      <Box className="bg-white py-16 border-t border-slate-100">
        <Container maxWidth="lg">
          <Box className="mb-12 text-center">
            <Typography
              variant="h2"
              className="font-bold mb-3 text-slate-900 tracking-tight"
              sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
            >
              {siteContent.catalog.title}
            </Typography>
            <Typography
              variant="body1"
              className="max-w-2xl mx-auto text-slate-600"
              sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}
            >
              {siteContent.catalog.description}
            </Typography>
          </Box>

          {allProducts.length > 0 ? (
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
              {allProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Box>
          ) : (
            <Box className="text-center py-12">
              <Typography variant="body1" color="text.secondary">
                {siteContent.catalog.emptyMessage}
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* Features Section */}
      <Box className="bg-white py-16">
        <Container maxWidth="lg">
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {siteContent.features.map((feature, index) => (
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

      {/* Location Section */}
      <Box className="bg-slate-50 py-16 border-t border-slate-100">
        <Container maxWidth="lg">
          <Box className="mb-12 text-center">
            <Box className="flex justify-center mb-4">
              <Box className="bg-blue-100 p-2 rounded-full text-blue-600">
                <LocationOn fontSize="large" />
              </Box>
            </Box>
            <Typography
              variant="h2"
              className="font-bold mb-3 text-slate-900 tracking-tight"
              sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
            >
              {siteContent.location.title}
            </Typography>
            <Typography
              variant="body1"
              className="max-w-2xl mx-auto text-slate-600"
              sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}
            >
              {siteContent.location.description}
            </Typography>
          </Box>

          <Paper
            elevation={0}
            className="overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50"
            sx={{ height: { xs: '350px', md: '500px' } }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3818.7606148174355!2d-58.94528140553753!3d-34.4511576163921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bc82dde9978f61%3A0xa8257ac1a2acd81c!2sVedia%202186%2C%20B1629AYB%20Pilar%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1766773251394!5m2!1ses-419!2sar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Phone Sale"
            />
          </Paper>

          <Box className="mt-8 text-center text-slate-500">
            <Typography variant="body1" className="font-semibold">
              {siteContent.location.address}
            </Typography>
            <Typography variant="body2" className="mt-1">
              {siteContent.location.hours}
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box className="bg-gray-900 text-white py-8">
        <Container maxWidth="lg">
          <Typography variant="body2" className="text-center opacity-80">
            {siteContent.footer.copy}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
