import { ContactConfig } from '@/frontend/types/product';
import { formatPrice } from '@/frontend/utils/formatters';

export const contactConfig: ContactConfig = {
  whatsapp: {
    phoneNumber: '5491112345678', // Replace with actual WhatsApp number
    messageTemplate: (product) =>
      `Hola! Estoy interesado en el ${product.title} - ${formatPrice(product.price)}`,
  },
  instagram: {
    username: 'phonesale', // Replace with actual Instagram username
  },
};
