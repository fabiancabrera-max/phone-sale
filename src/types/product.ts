export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  featured: boolean;
  specs?: {
    storage?: string;
    color?: string;
    condition?: string;
    [key: string]: string | undefined;
  };
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
