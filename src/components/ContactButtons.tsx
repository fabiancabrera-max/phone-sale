'use client';

import React from 'react';
import { Product } from '@/types/product';
import { Box, Button } from '@mui/material';
import { WhatsApp, Instagram } from '@mui/icons-material';
import { contactConfig } from '@/config/contact';

interface ContactButtonsProps {
  product: Product;
}

const ContactButtons: React.FC<ContactButtonsProps> = ({ product }) => {
  const handleWhatsAppClick = () => {
    const message = contactConfig.whatsapp.messageTemplate(product);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${contactConfig.whatsapp.phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleInstagramClick = () => {
    const instagramUrl = `https://instagram.com/${contactConfig.instagram.username}`;
    window.open(instagramUrl, '_blank');
  };

  return (
    <Box className="flex flex-col sm:flex-row gap-4 w-full">
      <Button
        variant="contained"
        size="large"
        startIcon={<WhatsApp />}
        onClick={handleWhatsAppClick}
        className="flex-1 py-4 font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
        sx={{
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #20BA5A 0%, #0F7A6C 100%)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        Contactar por WhatsApp
      </Button>

      <Button
        variant="contained"
        size="large"
        startIcon={<Instagram />}
        onClick={handleInstagramClick}
        className="flex-1 py-4 font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
        sx={{
          background:
            'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #F77737 100%)',
          '&:hover': {
            background:
              'linear-gradient(135deg, #6B2E94 0%, #D41818 50%, #D66530 100%)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        Ver en Instagram
      </Button>
    </Box>
  );
};

export default ContactButtons;
