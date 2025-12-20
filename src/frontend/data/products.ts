import { Product } from '@/frontend/types/product';

export const products: Product[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro Max',
    description:
      'El iPhone 15 Pro Max más potente hasta la fecha. Con el revolucionario chip A17 Pro, cámara de 48MP con zoom óptico 5x, y diseño en titanio ultraligero. Pantalla Super Retina XDR de 6.7 pulgadas con ProMotion. Batería de larga duración y carga rápida.',
    price: 1299,
    images: [
      '/images/iphone-15-pro-max.png',
      '/images/iphone-15-pro-max-back.png',
      '/images/iphone-15-pro-max-side.png',
      '/images/iphone-15-pro-max-camera.png',
      'https://placehold.co/800x800/e5e5e5/333333?text=iPhone+15+Pro+Max+Box',
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
      'Potencia profesional en un tamaño perfecto. Chip A17 Pro, sistema de cámaras pro y botón de acción personalizable. Diseño de titanio aeroespacial, resistente y ligero. La mejor experiencia iPhone en 6.1 pulgadas.',
    price: 1099,
    images: [
      '/images/iphone-15-pro-max.png', // Reusing Pro Max image
      '/images/iphone-15-pro-max-back.png', // Reusing Pro Max back
      '/images/iphone-15-pro-max-side.png', // Reusing Pro Max side
      '/images/iphone-15-pro-max-camera.png', // Reusing Pro Max camera
      'https://placehold.co/800x800/e5e5e5/333333?text=iPhone+15+Pro+Box',
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
      'El nuevo estándar. Dynamic Island, cámara principal de 48MP y diseño con parte trasera de vidrio con infusión de color. Chip A16 Bionic para un rendimiento increíble y eficiencia energética.',
    price: 899,
    images: [
      '/images/iphone-15.png',
      '/images/iphone-15-back.png',
      '/images/iphone-15-side.png',
      '/images/iphone-15-camera.png',
      'https://placehold.co/800x800/e5e5e5/333333?text=iPhone+15+Box',
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
      'Una forma mágica de interactuar con tu iPhone. Dynamic Island, cámara de 48MP y pantalla siempre activa. Chip A16 Bionic. Batería para todo el día y detección de choques.',
    price: 1099,
    images: [
      '/images/iphone-14-pro.png', // Reusing 14 Pro image
      '/images/iphone-14-pro-back.png',
      '/images/iphone-14-pro-side.png', // Using substitute
      '/images/iphone-14-pro-camera.png', // Using substitute
      'https://placehold.co/800x800/e5e5e5/333333?text=iPhone+14+Pro+Max+Box',
    ],
    featured: true,
    specs: {
      storage: '256GB',
      color: 'Morado Oscuro',
      condition: 'Nuevo',
    },
  },
  {
    id: '5',
    title: 'iPhone 14 Pro',
    description:
      'Innovación pro. Dynamic Island, nueva cámara de 48MP y pantalla Super Retina XDR siempre activa. Tecnología ProMotion y el potente chip A16 Bionic.',
    price: 999,
    images: [
      '/images/iphone-14-pro.png',
      '/images/iphone-14-pro-back.png',
      '/images/iphone-14-pro-side.png', // Using substitute
      '/images/iphone-14-pro-camera.png', // Using substitute
      'https://placehold.co/800x800/e5e5e5/333333?text=iPhone+14+Pro+Box',
    ],
    featured: false,
    specs: {
      storage: '128GB',
      color: 'Negro Espacial',
      condition: 'Nuevo',
    },
  },
  {
    id: '6',
    title: 'iPhone 14',
    description:
      'Lleno de prestaciones fantásticas. Sistema de cámara dual avanzado, modo Cine y modo Acción. Batería para todo el día y chip A15 Bionic con GPU de 5 núcleos.',
    price: 799,
    images: [
      '/images/iphone-15.png', // Using iPhone 15 image as placeholder for now
      'https://placehold.co/800x800/e5e5e5/333333?text=iPhone+14+Back',
      'https://placehold.co/800x800/e5e5e5/333333?text=iPhone+14+Side',
      'https://placehold.co/800x800/e5e5e5/333333?text=iPhone+14+Camera',
      'https://placehold.co/800x800/e5e5e5/333333?text=iPhone+14+Box',
    ],
    featured: false,
    specs: {
      storage: '128GB',
      color: 'Azul',
      condition: 'Nuevo',
    },
  },
  {
    id: '7',
    title: 'iPhone 13 Pro',
    description:
      'Un sistema de cámaras pro mucho más potente. Pantalla Super Retina XDR con ProMotion para una respuesta más rápida y fluida. Chip A15 Bionic ultrarrápido.',
    price: 899,
    images: [
      '/images/iphone-14-pro.png', // Using 14 Pro as placeholder
      'https://placehold.co/800x800/e5e5e5/333333?text=iPhone+13+Pro+Back',
      'https://placehold.co/800x800/e5e5e5/333333?text=iPhone+13+Pro+Side',
      'https://placehold.co/800x800/e5e5e5/333333?text=iPhone+13+Pro+Camera',
      'https://placehold.co/800x800/e5e5e5/333333?text=iPhone+13+Pro+Box',
    ],
    featured: false,
    specs: {
      storage: '128GB',
      color: 'Grafito',
      condition: 'Usado - Como Nuevo',
    },
  },
  {
    id: '8',
    title: 'iPhone 13',
    description:
      'Tu nuevo superpoder. Sistema de cámara dual más avanzado. Chip A15 Bionic. Un gran salto en duración de batería. Diseño resistente y pantalla Super Retina XDR más brillante.',
    price: 699,
    images: [
      '/images/iphone-15.png', // Using 15 as placeholder
      'https://placehold.co/800x800/e5e5e5/333333?text=iPhone+13+Back',
      'https://placehold.co/800x800/e5e5e5/333333?text=iPhone+13+Side',
      'https://placehold.co/800x800/e5e5e5/333333?text=iPhone+13+Camera',
      'https://placehold.co/800x800/e5e5e5/333333?text=iPhone+13+Box',
    ],
    featured: false,
    specs: {
      storage: '128GB',
      color: 'Medianoche',
      condition: 'Usado - Excelente',
    },
  },
];

export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.featured);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};
