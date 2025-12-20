'use client';

import React from 'react';
import { Product } from '@/frontend/types/product';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const theme = useTheme();

  // Breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Determine items per page based on screen size
  const itemsPerPage = isMobile ? 1 : isTablet ? 2 : 3;

  const maxIndex = Math.max(0, products.length - itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Reset index if screen size changes
  React.useEffect(() => {
    setCurrentIndex(0);
  }, [itemsPerPage]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [maxIndex]);

  // Touch handling state
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touch end
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < maxIndex) {
      handleNext();
    }

    if (isRightSwipe && currentIndex > 0) {
      handlePrev();
    }
  };

  // Percentage width for each item
  const itemWidth = 100 / itemsPerPage;

  return (
    <Box
      className="relative w-full overflow-hidden py-4 md:py-8 group"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Box
        className="flex items-center justify-center"
        sx={{ gap: { xs: 0, sm: 2, md: 4 } }}
      >
        {/* Navigation Button - Left */}
        <IconButton
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="bg-white shadow-lg hover:bg-gray-50 disabled:opacity-30 z-10"
          sx={{
            display: { xs: 'none', sm: 'flex' },
            width: { sm: 40, md: 48 },
            height: { sm: 40, md: 48 },
            '&:hover': { backgroundColor: '#f9fafb' },
          }}
        >
          <ChevronLeft />
        </IconButton>

        {/* Carousel Track Container */}
        <Box className="flex-1 overflow-hidden">
          {/* The Track itself - keeps 100% width of parent, items overflow it */}
          <Box
            className="flex transition-transform duration-500 ease-in-out"
            sx={{
              width: '100%', // Track is 100% of the visible area
              transform: `translateX(-${currentIndex * itemWidth}%)`, // Move by percentage of visible area
            }}
          >
            {products.map((product) => (
              <Box
                key={product.id}
                sx={{
                  flex: `0 0 ${itemWidth}%`, // Don't grow, don't shrink, fixed percentage width
                  maxWidth: `${itemWidth}%`,
                  px: { xs: 0.5, sm: 1.5 }, // Padding creates the visual gap
                  boxSizing: 'border-box',
                }}
              >
                <ProductCard product={product} />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Navigation Button - Right */}
        <IconButton
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
          className="bg-white shadow-lg hover:bg-gray-50 disabled:opacity-30 z-10"
          sx={{
            display: { xs: 'none', sm: 'flex' },
            width: { sm: 40, md: 48 },
            height: { sm: 40, md: 48 },
            '&:hover': { backgroundColor: '#f9fafb' },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Mobile/Tablet Navigation Dots */}
      <Box className="flex justify-center gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${index === currentIndex
                ? 'bg-primary-500 w-8'
                : 'bg-gray-300 hover:bg-gray-400 w-2'
              }`}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ProductCarousel;
