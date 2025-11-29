/**
 * Formatea un número como precio en dólares estadounidenses
 * @param price - El precio a formatear
 * @returns El precio formateado como string (ej: "$1,299.00")
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Formatea un número como precio en pesos argentinos
 * @param price - El precio a formatear
 * @returns El precio formateado como string (ej: "$1.299")
 */
export const formatPriceARS = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Formatea un número con separadores de miles
 * @param value - El número a formatear
 * @returns El número formateado (ej: "1,299")
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('es-AR').format(value);
};
