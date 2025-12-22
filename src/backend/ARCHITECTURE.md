# Arquitectura Backend - Phone Sale

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Admin Panel  │  │ Product List │  │ Product View │          │
│  │  (Upload)    │  │   (Display)  │  │   (Display)  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                  │                   │
└─────────┼─────────────────┼──────────────────┼───────────────────┘
          │                 │                  │
          │ Firebase Auth   │                  │
          │ ID Token        │                  │
          ▼                 ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API ROUTES (Next.js)                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ POST /api/products/upload-image                          │   │
│  │  1. Verify Firebase ID Token (Admin SDK)                │   │
│  │  2. Check user quota (daily limit)                      │   │
│  │  3. Validate file metadata (type, size)                 │   │
│  │  4. Generate secure key: users/{uid}/{uuid}.{ext}       │   │
│  │  5. Upload to Cloud Storage                             │   │
│  │  6. Get public CDN URL                                  │   │
│  │  7. Save metadata to Firestore                          │   │
│  │  8. Return public URL + metadata                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ POST /api/products                                       │   │
│  │  1. Verify Firebase ID Token                            │   │
│  │  2. Validate product data                               │   │
│  │  3. Create product in Firestore                         │   │
│  │  4. Return product with ID                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ PUT /api/products/[id]                                   │   │
│  │  1. Verify Firebase ID Token                            │   │
│  │  2. Validate product data                               │   │
│  │  3. Update product in Firestore                         │   │
│  │  4. Return updated product                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ GET /api/products                                        │   │
│  │  1. Optional: Verify auth for admin features            │   │
│  │  2. Query products from Firestore                       │   │
│  │  3. Return products list                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ DELETE /api/products/[id]                                │   │
│  │  1. Verify Firebase ID Token                            │   │
│  │  2. Delete images from Cloud Storage                    │   │
│  │  3. Delete product from Firestore                       │   │
│  │  4. Return success                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────┬───────────────────────┬───────────────────────────────┘
          │                       │
          ▼                       ▼
┌──────────────────┐    ┌──────────────────────┐
│  Cloud Storage   │    │     Firestore        │
│  ┌────────────┐  │    │  ┌────────────────┐  │
│  │   images/  │  │    │  │   products/    │  │
│  │  users/    │  │    │  │   - id         │  │
│  │   {uid}/   │  │    │  │   - title      │  │
│  │   {uuid}   │  │    │  │   - price      │  │
│  │   .jpg     │  │    │  │   - images[]   │  │
│  └────────────┘  │    │  │   - ...        │  │
│                  │    │  └────────────────┘  │
│  Public CDN URLs │    │  ┌────────────────┐  │
│  via Firebase    │    │  │  image_quota/  │  │
│                  │    │  │   - userId     │  │
│                  │    │  │   - count      │  │
│                  │    │  │   - date       │  │
│                  │    │  └────────────────┘  │
└──────────────────┘    └──────────────────────┘
```

## Flujo de Subida de Imágenes

```
Admin Frontend
     │
     │ 1. User selects image(s)
     │
     ▼
Firebase Auth
     │
     │ 2. Get ID Token
     │
     ▼
POST /api/products/upload-image
     │
     ├─► 3. Verify ID Token (Admin SDK)
     │
     ├─► 4. Check daily quota
     │       (Firestore: image_quota/{userId}/{date})
     │
     ├─► 5. Validate file
     │       - Type: jpeg/png/webp
     │       - Size: max 5MB
     │
     ├─► 6. Generate secure key
     │       users/{uid}/{uuid}.{ext}
     │
     ├─► 7. Upload to Cloud Storage
     │       (Firebase Storage SDK)
     │
     ├─► 8. Get public URL
     │       https://firebasestorage.googleapis.com/...
     │
     ├─► 9. Save metadata to Firestore
     │       - url
     │       - key
     │       - userId
     │       - uploadedAt
     │
     └─► 10. Return to frontend
             { url, key, metadata }
```

## Estructura de Datos

### Firestore Collections

#### products
```typescript
{
  id: string;                    // Auto-generated
  title: string;                 // "iPhone 15 Pro Max"
  description: string;           // Product description
  price: number;                 // 1299
  specs: {
    condition: 'new' | 'used_as_new' | 'used' | 'refurbished',  // "Nuevo" | "Usado - Como Nuevo" | "Usado" | "Reparado"
    color: string,                 // "Titanio Natural"
    storage: string,               // "256GB"
  };
  images: string[];              // Array of public CDN URLs (max 5)
  status: 'featured' | 'on_sale' | 'sold';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;             // User ID
}
```

#### image_quota
```typescript
{
  userId: string;                // User ID
  date: string;                  // "2024-12-20"
  count: number;                 // Number of images uploaded today
  updatedAt: Timestamp;
}
```

#### image_metadata (optional - for tracking)
```typescript
{
  id: string;                    // Auto-generated
  url: string;                   // Public CDN URL
  storagePath: string;           // users/{uid}/{uuid}.{ext}
  userId: string;                // Uploader ID
  productId?: string;            // Associated product (if any)
  contentType: string;           // "image/jpeg"
  size: number;                  // Bytes
  uploadedAt: Timestamp;
}
```

## Seguridad y Control de Costos

### 1. Autenticación
- ✅ Todos los endpoints de escritura requieren Firebase ID Token
- ✅ Verificación server-side con Firebase Admin SDK
- ✅ Solo usuarios autenticados pueden subir/editar

### 2. Límites de Cuota
- ✅ Máximo 50 imágenes por usuario por día
- ✅ Máximo 5 imágenes por producto
- ✅ Tamaño máximo por imagen: 5MB
- ✅ Tracking en Firestore (collection: image_quota)

### 3. Validación de Archivos
- ✅ Content-Type permitidos: image/jpeg, image/png, image/webp
- ✅ Validación de tamaño antes de upload
- ✅ Generación automática de nombres (no user-controlled)

### 4. Naming Convention
- ✅ Patrón: `images/{uuid}.{ext}`
- ✅ UUID v4 para evitar colisiones
- ✅ Extensión basada en content-type validado

### 5. Rate Limiting
- ✅ Implementado con Upstash Redis (recomendado)
- ✅ Límite: 100 requests/hora por IP
- ✅ Límite: 500 requests/día por usuario

### 6. Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // La nueva ruta es /images/{imageId}
    match /images/{imageId} {
      // Cualquier usuario autenticado puede leer.
      allow read: if request.auth != null;

      // Cualquier usuario autenticado puede escribir, con restricciones de tamaño y tipo de imagen.
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024  // 5MB
                   && request.resource.contentType.matches('image/(jpeg|png|webp)');

      // Cualquier usuario autenticado puede eliminar.
      allow delete: if request.auth != null;
    }
  }
}
```

### 7. Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - anyone can read, only auth users can write
    match /products/{productId} {
      allow read: if true;
      allow create: if request.auth != null 
                    && request.resource.data.createdBy == request.auth.uid;
      allow update: if request.auth != null 
                    && resource.data.createdBy == request.auth.uid;
      allow delete: if request.auth != null 
                    && resource.data.createdBy == request.auth.uid;
    }
    
    // Image quota - only owner can read/write
    match /image_quota/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Image metadata - only owner can read/write
    match /image_metadata/{imageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
                   && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## Optimización de Imágenes

### Opción A: Cloud Functions (Automático)
```typescript
// Trigger automático al subir imagen
// Genera thumbnails: 200x200, 400x400, 800x800
// Usa Sharp para resize
// Guarda en mismo bucket con sufijo _200x200, etc.
```

### Opción B: Next.js Image Component (Recomendado)
```typescript
// Usar Next.js Image con CDN de Firebase
<Image 
  src={product.images[0]}
  width={800}
  height={800}
  sizes="(max-width: 768px) 100vw, 50vw"
  alt={product.title}
/>
// Next.js optimiza automáticamente
```

### Opción C: Firebase Extensions
- Instalar "Resize Images" extension
- Configuración automática
- Genera múltiples tamaños
- Sin código adicional

## Variables de Entorno Requeridas

```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key

# Firebase Client (Frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Rate Limiting (Optional - Upstash Redis)
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# App Config
MAX_IMAGE_SIZE_MB=5
MAX_IMAGES_PER_PRODUCT=5
MAX_IMAGES_PER_USER_PER_DAY=50
```

## Checklist de Implementación

### Fase 1: Setup
- [ x ] Crear proyecto Firebase
- [ x ] Habilitar Authentication (Email/Password)
- [ x ] Habilitar Firestore
- [ x ] Habilitar Cloud Storage
- [ x ] Configurar Security Rules
- [ x ] Instalar dependencias npm
- [ x ] Configurar variables de entorno

### Fase 2: Backend API
- [x] Crear Firebase Admin SDK config
- [x] Implementar middleware de autenticación
- [x] Implementar rate limiting (Cuotas de imágenes)
- [x] Crear endpoint upload-image
- [x] Crear endpoint products (CRUD)
- [x] Implementar validaciones
- [x] Implementar quota tracking

### Fase 3: Frontend Admin
- [x] Crear página de admin
- [x] Implementar Firebase Auth UI
- [x] Crear formulario de producto
- [x] Implementar upload de imágenes
- [x] Mostrar preview de imágenes
- [x] Implementar lista de productos
- [x] Implementar edición de productos

### Fase 4: Optimización
- [ ] Configurar Firebase Image Resize Extension
- [ ] Implementar Next.js Image optimization
- [ ] Agregar loading states
- [ ] Agregar error handling
- [ ] Implementar retry logic

### Fase 5: Testing & Deploy
- [ ] Testing de endpoints
- [ ] Testing de seguridad
- [ ] Testing de límites
- [ ] Deploy a Vercel
- [ ] Configurar dominios
- [ ] Monitoreo y logs
