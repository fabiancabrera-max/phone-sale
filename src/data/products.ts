import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro Max',
    description:
      'El iPhone 15 Pro Max más potente hasta la fecha. Con el revolucionario chip A17 Pro, cámara de 48MP con zoom óptico 5x, y diseño en titanio ultraligero. Pantalla Super Retina XDR de 6.7 pulgadas con ProMotion. Batería de larga duración y carga rápida.',
    price: 1299,
    images: [
      'https://placehold.co/800x800/e8e8ed/1d1d1f?text=iPhone+15+Pro+Max',
      'https://placehold.co/800x800/e8e8ed/1d1d1f?text=iPhone+15+Pro+Max+Front',
      'https://placehold.co/800x800/e8e8ed/1d1d1f?text=iPhone+15+Pro+Max+Back',
      'https://placehold.co/800x800/e8e8ed/1d1d1f?text=iPhone+15+Pro+Max+Side',
      'https://placehold.co/800x800/e8e8ed/1d1d1f?text=iPhone+15+Pro+Max+Camera',
    ],
    featured: true,
    specs: {
      storage: '256GB',
      color: 'Titanio Natural',
      condition: 'Nuevo',
    },
  },
  {
    id: '2',
    title: 'iPhone 15 Pro',
    description:
      'iPhone 15 Pro con chip A17 Pro y diseño en titanio. Cámara principal de 48MP con teleobjetivo 3x. Pantalla Super Retina XDR de 6.1 pulgadas siempre activa. Action Button personalizable para accesos rápidos.',
    price: 1099,
    images: [
      'https://placehold.co/800x800/a7c7e7/1d1d1f?text=iPhone+15+Pro',
      'https://placehold.co/800x800/a7c7e7/1d1d1f?text=iPhone+15+Pro+Front',
      'https://placehold.co/800x800/a7c7e7/1d1d1f?text=iPhone+15+Pro+Back',
      'https://placehold.co/800x800/a7c7e7/1d1d1f?text=iPhone+15+Pro+Side',
      'https://placehold.co/800x800/a7c7e7/1d1d1f?text=iPhone+15+Pro+Camera',
    ],
    featured: true,
    specs: {
      storage: '128GB',
      color: 'Titanio Azul',
      condition: 'Nuevo',
    },
  },
  {
    id: '3',
    title: 'iPhone 15',
    description:
      'iPhone 15 con Dynamic Island y cámara principal de 48MP. Chip A16 Bionic de alto rendimiento. Pantalla Super Retina XDR de 6.1 pulgadas. Diseño en aluminio con vidrio de color infusionado.',
    price: 899,
    images: [
      'https://placehold.co/800x800/ffc0cb/1d1d1f?text=iPhone+15',
      'https://placehold.co/800x800/ffc0cb/1d1d1f?text=iPhone+15+Front',
      'https://placehold.co/800x800/ffc0cb/1d1d1f?text=iPhone+15+Back',
      'https://placehold.co/800x800/ffc0cb/1d1d1f?text=iPhone+15+Side',
      'https://placehold.co/800x800/ffc0cb/1d1d1f?text=iPhone+15+Camera',
    ],
    featured: true,
    specs: {
      storage: '128GB',
      color: 'Rosa',
      condition: 'Nuevo',
    },
  },
  {
    id: '4',
    title: 'iPhone 14 Pro Max',
    description:
      'iPhone 14 Pro Max con Dynamic Island y pantalla siempre activa. Chip A16 Bionic y sistema de cámara Pro de 48MP. Detección de choques y SOS de emergencia vía satélite.',
    price: 999,
    images: [
      'https://placehold.co/800x800/9b7cb6/ffffff?text=iPhone+14+Pro+Max',
      'https://placehold.co/800x800/9b7cb6/ffffff?text=iPhone+14+Pro+Max+Front',
      'https://placehold.co/800x800/9b7cb6/ffffff?text=iPhone+14+Pro+Max+Back',
      'https://placehold.co/800x800/9b7cb6/ffffff?text=iPhone+14+Pro+Max+Side',
      'https://placehold.co/800x800/9b7cb6/ffffff?text=iPhone+14+Pro+Max+Camera',
    ],
    featured: false,
    specs: {
      storage: '256GB',
      color: 'Morado Oscuro',
      condition: 'Como Nuevo',
    },
  },
  {
    id: '5',
    title: 'iPhone 14 Pro',
    description:
      'iPhone 14 Pro con Dynamic Island revolucionario. Cámara Pro de 48MP con modo Acción. Pantalla Super Retina XDR de 6.1 pulgadas siempre activa. Chip A16 Bionic ultrarrápido.',
    price: 899,
    images: [
      'https://placehold.co/800x800/c0c0c0/1d1d1f?text=iPhone+14+Pro',
      'https://placehold.co/800x800/c0c0c0/1d1d1f?text=iPhone+14+Pro+Front',
      'https://placehold.co/800x800/c0c0c0/1d1d1f?text=iPhone+14+Pro+Back',
      'https://placehold.co/800x800/c0c0c0/1d1d1f?text=iPhone+14+Pro+Side',
      'https://placehold.co/800x800/c0c0c0/1d1d1f?text=iPhone+14+Pro+Camera',
    ],
    featured: false,
    specs: {
      storage: '128GB',
      color: 'Plata',
      condition: 'Como Nuevo',
    },
  },
  {
    id: '6',
    title: 'iPhone 14',
    description:
      'iPhone 14 con cámara dual mejorada y modo Acción. Chip A15 Bionic con GPU de 5 núcleos. Pantalla Super Retina XDR de 6.1 pulgadas. Batería de larga duración.',
    price: 749,
    images: [
      'https://placehold.co/800x800/4a90e2/ffffff?text=iPhone+14',
      'https://placehold.co/800x800/4a90e2/ffffff?text=iPhone+14+Front',
      'https://placehold.co/800x800/4a90e2/ffffff?text=iPhone+14+Back',
      'https://placehold.co/800x800/4a90e2/ffffff?text=iPhone+14+Side',
      'https://placehold.co/800x800/4a90e2/ffffff?text=iPhone+14+Camera',
    ],
    featured: true,
    specs: {
      storage: '128GB',
      color: 'Azul',
      condition: 'Excelente',
    },
  },
  {
    id: '7',
    title: 'iPhone 13 Pro',
    description:
      'iPhone 13 Pro con sistema de cámara Pro. Chip A15 Bionic. Pantalla Super Retina XDR con ProMotion de 120Hz. Diseño premium en acero inoxidable quirúrgico.',
    price: 699,
    images: [
      'https://placehold.co/800x800/5f8575/ffffff?text=iPhone+13+Pro',
      'https://placehold.co/800x800/5f8575/ffffff?text=iPhone+13+Pro+Front',
      'https://placehold.co/800x800/5f8575/ffffff?text=iPhone+13+Pro+Back',
      'https://placehold.co/800x800/5f8575/ffffff?text=iPhone+13+Pro+Side',
      'https://placehold.co/800x800/5f8575/ffffff?text=iPhone+13+Pro+Camera',
    ],
    featured: false,
    specs: {
      storage: '256GB',
      color: 'Verde Alpino',
      condition: 'Excelente',
    },
  },
  {
    id: '8',
    title: 'iPhone 13',
    description:
      'iPhone 13 con sistema de cámara dual avanzado. Chip A15 Bionic. Pantalla Super Retina XDR de 6.1 pulgadas. Diseño resistente con Ceramic Shield.',
    price: 599,
    images: [
      'https://placehold.co/800x800/1a1a1a/ffffff?text=iPhone+13',
      'https://placehold.co/800x800/1a1a1a/ffffff?text=iPhone+13+Front',
      'https://placehold.co/800x800/1a1a1a/ffffff?text=iPhone+13+Back',
      'https://placehold.co/800x800/1a1a1a/ffffff?text=iPhone+13+Side',
      'https://placehold.co/800x800/1a1a1a/ffffff?text=iPhone+13+Camera',
    ],
    featured: false,
    specs: {
      storage: '128GB',
      color: 'Medianoche',
      condition: 'Muy Bueno',
    },
  },
];

export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.featured);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};
