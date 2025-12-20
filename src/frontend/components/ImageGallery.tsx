'use client';

import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const handlePrev = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box className="w-full">
      {/* Main Image */}
      <Box className="relative w-full aspect-square mb-4 rounded-2xl overflow-hidden bg-gray-100 group">
        <img
          src={images[selectedImage]}
          alt={`${title} - Image ${selectedImage + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Navigation Arrows */}
        <IconButton
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          sx={{ width: 48, height: 48 }}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          sx={{ width: 48, height: 48 }}
        >
          <ChevronRight />
        </IconButton>

        {/* Image Counter */}
        <Box className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {selectedImage + 1} / {images.length}
        </Box>
      </Box>

      {/* Thumbnails */}
      <Box className="flex gap-4 overflow-x-auto pb-2 px-1">
        {images.map((image, index) => (
          <Box
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
              index === selectedImage
                ? 'border-slate-900 opacity-100 shadow-md'
                : 'border-transparent opacity-50 hover:opacity-100 hover:border-slate-200'
            }`}
          >
            <img
              src={image}
              alt={`${title} - Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ImageGallery;
