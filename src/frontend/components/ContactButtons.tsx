'use client';

import React from 'react';
import { Product } from '@/frontend/types/product';
import { Box, Button } from '@mui/material';
import { WhatsApp, Instagram } from '@mui/icons-material';
import { contactConfig } from '@/frontend/config/contact';

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
          background: 'linear-gradient(135deg, #0f172a 0%, #10b981 100%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #1e293b 0%, #059669 100%)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        WhatsApp
      </Button>

      <Button
        variant="contained"
        size="large"
        startIcon={<Instagram />}
        onClick={handleInstagramClick}
        className="flex-1 py-4 font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #8b5cf6 100%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #1e293b 0%, #7c3aed 100%)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        Instagram
      </Button>
    </Box>
  );
};

export default ContactButtons;
