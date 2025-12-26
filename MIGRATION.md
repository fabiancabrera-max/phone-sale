# Guía de Migración - Separación Frontend/Backend

## Cambios Realizados

Se ha reorganizado la estructura del proyecto para separar claramente el código de frontend y backend, facilitando el desarrollo futuro del backend.

## Nueva Estructura

```
src/
├── app/                    # Next.js App Router (debe permanecer aquí por requisitos de Next.js)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── product/[id]/
├── frontend/               # Código del frontend (componentes, lógica, datos)
│   ├── components/         # Componentes React
│   ├── config/            # Configuración del frontend
│   ├── data/              # Datos mock (temporal)
│   ├── theme/             # Temas y estilos
│   ├── types/             # Tipos TypeScript
│   └── utils/             # Utilidades
└── backend/               # Preparado para desarrollo del backend
    └── README.md          # Guía para comenzar con el backend
```

## Cambios en las Importaciones

Todas las importaciones ahora usan el prefijo `@/frontend/` para acceder al código del frontend:

### Antes:

```typescript
import { Product } from '@/types/product';
import { formatPrice } from '@/utils/formatters';
import ProductCard from '@/components/ProductCard';
```

### Ahora:

```typescript
import { Product } from '@/frontend/types/product';
import { formatPrice } from '@/frontend/utils/formatters';
import ProductCard from '@/frontend/components/ProductCard';
```

## Archivos Modificados

### Archivos de App Router (`src/app/`)

- `app/page.tsx` - Actualizado imports
- `app/layout.tsx` - Actualizado imports
- `app/product/[id]/page.tsx` - Actualizado imports

### Archivos de Frontend (`src/frontend/`)

- `frontend/components/ProductCarousel.tsx` - Actualizado imports
- `frontend/components/ProductCard.tsx` - Actualizado imports
- `frontend/components/ContactButtons.tsx` - Actualizado imports
- `frontend/config/contact.ts` - Actualizado imports
- `frontend/data/products.ts` - Actualizado imports

### Archivos de Configuración

- `tsconfig.json` - Sin cambios (alias `@/` apunta a `src/`)
- `README.md` - Actualizado con nueva estructura

## ¿Por qué `app/` no está dentro de `frontend/`?

Next.js 15 con App Router requiere que la carpeta `app/` esté ubicada en `src/app/` o en la raíz del proyecto. No es posible moverla a una subcarpeta como `src/frontend/app/` sin configuraciones complejas que podrían causar problemas.

La solución adoptada mantiene `app/` en su ubicación esperada por Next.js, mientras que todo el código reutilizable (componentes, utilidades, tipos, etc.) está organizado en `src/frontend/`.

## Próximos Pasos para el Backend

1. **Decidir el stack tecnológico**:
   - Framework: Express.js, Fastify, NestJS, etc.
   - Base de datos: PostgreSQL, MongoDB, MySQL, etc.
   - ORM: Prisma, TypeORM, Mongoose, etc.

2. **Crear la estructura del backend** en `src/backend/`:

   ```
   backend/
   ├── api/
   ├── controllers/
   ├── models/
   ├── routes/
   ├── middleware/
   ├── config/
   ├── utils/
   └── server.ts
   ```

3. **Migrar datos mock a API**:
   - Los datos actuales están en `src/frontend/data/products.ts`
   - Una vez que el backend esté listo, reemplazar estas importaciones con llamadas a la API

4. **Configurar CORS y comunicación**:
   - El frontend (Next.js) correrá en un puerto (ej: 3000)
   - El backend correrá en otro puerto (ej: 4000)
   - Configurar CORS en el backend para permitir requests del frontend

## Verificación

El proyecto ha sido probado y funciona correctamente con la nueva estructura:

- ✅ Servidor de desarrollo inicia sin errores
- ✅ Todas las páginas se compilan correctamente
- ✅ Las importaciones se resuelven correctamente
- ✅ No hay errores de TypeScript

## Comandos Útiles

```bash
# Desarrollo del frontend (Next.js)
npm run dev

# Build del frontend
npm run build

# Cuando el backend esté listo, podrías tener:
# npm run dev:backend
# npm run dev:all (frontend + backend)
```

## Notas Importantes

- El alias `@/` apunta a `src/`, por lo que `@/frontend/` accede a `src/frontend/`
- Los archivos en `src/app/` importan desde `@/frontend/`
- Los archivos en `src/frontend/` también importan desde `@/frontend/`
- Esta estructura facilita la separación de responsabilidades y el desarrollo paralelo de frontend y backend
