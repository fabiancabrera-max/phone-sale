import { ContactConfig } from '@/types/product';

export const contactConfig: ContactConfig = {
  whatsapp: {
    phoneNumber: '5491112345678', // Replace with actual WhatsApp number
    messageTemplate: (product) =>
      `Hola! Estoy interesado en el ${product.title} - $${product.price}`,
  },
  instagram: {
    username: 'phonesale', // Replace with actual Instagram username
  },
};
