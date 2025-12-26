# Frontend - Phone Sale

Esta carpeta contiene todo el código del frontend del proyecto Phone Sale, construido con Next.js 15, React 19, TypeScript, Material-UI y Tailwind CSS.

## Estructura

```
frontend/
├── app/              # Next.js App Router
│   ├── layout.tsx    # Layout principal
│   ├── page.tsx      # Página de inicio
│   ├── globals.css   # Estilos globales
│   └── product/      # Páginas de productos
├── components/       # Componentes React reutilizables
│   ├── ContactButtons.tsx
│   ├── ImageGallery.tsx
│   ├── ProductCard.tsx
│   └── ProductCarousel.tsx
├── config/          # Configuración del frontend
│   └── contact.ts   # Configuración de contacto
├── data/            # Datos mock (temporal hasta que el backend esté listo)
│   └── products.ts  # Productos de ejemplo
├── theme/           # Configuración de temas
│   └── muiTheme.ts  # Tema de Material-UI
├── types/           # Tipos TypeScript
│   └── product.ts   # Tipos de productos
└── utils/           # Utilidades
    └── formatters.ts # Funciones de formateo
```

## Tecnologías

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + Material-UI
- **Iconos**: Material Icons

## Alias de Importación

El proyecto usa el alias `@/` para importaciones absolutas que apuntan a `src/frontend/`:

```typescript
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';
```

## Notas

- Los datos actualmente están en `/data/products.ts` como mock data
- Una vez que el backend esté listo, estos datos se reemplazarán por llamadas a la API
