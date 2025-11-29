'use client';

import React from 'react';
import { Product } from '@/types/product';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const itemsPerPage = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, products.length - itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [maxIndex]);

  return (
    <Box className="relative w-full overflow-hidden py-8">
      <Box className="flex items-center justify-center gap-4">
        <IconButton
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="hidden md:flex bg-white shadow-lg hover:bg-gray-50 disabled:opacity-30"
          sx={{
            width: 48,
            height: 48,
            '&:hover': { backgroundColor: '#f9fafb' },
          }}
        >
          <ChevronLeft />
        </IconButton>

        <Box className="flex-1 overflow-hidden">
          <Box
            className="flex transition-transform duration-500 ease-in-out gap-6"
            sx={{
              transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
            }}
          >
            {products.map((product) => (
              <Box
                key={product.id}
                sx={{
                  minWidth: isMobile
                    ? '100%'
                    : `calc(${100 / itemsPerPage}% - 16px)`,
                  px: 1,
                }}
              >
                <ProductCard product={product} />
              </Box>
            ))}
          </Box>
        </Box>

        <IconButton
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
          className="hidden md:flex bg-white shadow-lg hover:bg-gray-50 disabled:opacity-30"
          sx={{
            width: 48,
            height: 48,
            '&:hover': { backgroundColor: '#f9fafb' },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Mobile Navigation Dots */}
      {isMobile && (
        <Box className="flex justify-center gap-2 mt-6">
          {products.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                index === currentIndex
                  ? 'bg-primary-500 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProductCarousel;
