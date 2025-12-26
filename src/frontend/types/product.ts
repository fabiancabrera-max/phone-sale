export type ProductStatus = 'featured' | 'on_sale' | 'sold';

export type ProductCondition = 'new' | 'used_as_new' | 'used' | 'refurbished';

export interface ProductSpecs {
  condition: ProductCondition;
  color: string;
  storage: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  status: ProductStatus;
  specs: ProductSpecs;
}

export interface ContactConfig {
  whatsapp: {
    phoneNumber: string;
    messageTemplate: (product: Product) => string;
  };
  instagram: {
    username: string;
  };
}
