'use client';

import React from 'react';
import { Product } from '@/frontend/types/product';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import Link from 'next/link';
import { formatPrice } from '@/frontend/utils/formatters';

interface ProductCardProps {
  product: Product;
}

const STATUS_CONFIG: Record<string, { label: string; sx?: any }> = {
  featured: {
    label: 'Destacado',
    sx: {
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      color: 'white',
    },
  },
  sold: {
    label: 'Vendido',
    sx: {
      bgcolor: '#475569', // Slate-600: Subtle yet clear
      color: 'white',
    },
  },
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const statusConfig = STATUS_CONFIG[product.status];

  return (
    <Link href={`/product/${product.id}`} className="no-underline">
      <Card
        className="h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer group"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0',
        }}
      >
        <Box className="relative overflow-hidden">
          <CardMedia
            component="img"
            height="300"
            image={product.images[0]}
            alt={product.title}
            className="transition-transform duration-500 group-hover:scale-110"
            sx={{
              height: 300,
              objectFit: 'cover',
            }}
          />
          {product.status !== 'on_sale' && statusConfig && (
            <Chip
              label={statusConfig.label}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                fontWeight: 'bold',
                boxShadow: 3,
                ...statusConfig.sx,
              }}
            />
          )}
        </Box>

        <CardContent className="flex-1 flex flex-col justify-between p-6">
          <Box>
            <Typography
              variant="h5"
              component="h3"
              className="font-bold mb-2 text-gray-900"
              sx={{ fontSize: '1.5rem' }}
            >
              {product.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              className="mb-4 line-clamp-2"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {product.description}
            </Typography>
          </Box>

          <Box className="flex items-center justify-between mt-4">
            <Typography
              variant="h4"
              className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              {formatPrice(product.price)}
            </Typography>
            <Typography
              variant="body2"
              className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform"
            >
              Ver detalles →
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
