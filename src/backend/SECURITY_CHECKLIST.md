# Checklist de Seguridad y Control de Costos

## 🔒 Seguridad

### Autenticación y Autorización

- [x] **Firebase ID Token Verification**
  - Todos los endpoints de escritura verifican el token con Firebase Admin SDK
  - Tokens expirados son rechazados automáticamente
  - Implementado en: `src/backend/middleware/auth.ts`

- [x] **Verificación de Propiedad**
  - Solo el creador puede editar/eliminar sus productos
  - Verificación en cada operación de escritura
  - Implementado en: `src/backend/lib/products.ts`

- [x] **Protección de Datos Sensibles**
  - Variables de entorno para credenciales
  - Private key nunca expuesta al cliente
  - `.env` en `.gitignore`

### Validación de Entrada

- [x] **Validación de Archivos**
  - Content-Type: solo `image/jpeg`, `image/png`, `image/webp`
  - Tamaño máximo: 5MB por imagen
  - Validación server-side antes de upload
  - Implementado en: `src/backend/utils/image.ts`

- [x] **Validación de Datos de Producto**
  - Longitud de título: 3-100 caracteres
  - Longitud de descripción: 10-1000 caracteres
  - Precio: 0-999999
  - Máximo 5 imágenes por producto
  - Implementado en: `src/backend/utils/validation.ts`

- [x] **Sanitización de Strings**
  - Trim de espacios
  - Normalización de espacios múltiples
  - Prevención de XSS básica

### Naming y Paths Seguros

- [x] **Generación Automática de Nombres**
  - Patrón: `users/{userId}/{uuid}.{ext}`
  - UUID v4 para evitar colisiones
  - Usuario no puede elegir el nombre del archivo
  - Implementado en: `src/backend/utils/image.ts`

- [x] **Separación por Usuario**
  - Cada usuario tiene su propia carpeta
  - Path incluye el UID del usuario
  - Previene acceso cruzado

### Firebase Security Rules

- [x] **Firestore Rules**
  - Productos publicados: lectura pública
  - Productos draft: solo owner
  - Escritura: solo autenticados y owners
  - Validación de estructura de datos
  - Archivo: `firestore.rules`

- [x] **Storage Rules**
  - Lectura: pública (CDN)
  - Escritura: solo owner de la carpeta
  - Validación de tipo y tamaño
  - Archivo: `storage.rules`

### Rate Limiting

- [ ] **Por IP** (Opcional - requiere Upstash Redis)
  - Límite: 100 requests/hora
  - Implementación pendiente
  - Recomendado para producción

- [ ] **Por Usuario** (Opcional - requiere Upstash Redis)
  - Límite: 500 requests/día
  - Implementación pendiente
  - Recomendado para producción

### Logging y Monitoreo

- [ ] **Error Logging**
  - Implementar Sentry o similar
  - Logs de errores críticos
  - Alertas automáticas

- [ ] **Audit Logs**
  - Registrar operaciones importantes
  - Quién, qué, cuándo
  - Retención de 90 días

## 💰 Control de Costos

### Límites de Cuota

- [x] **Cuota Diaria por Usuario**
  - Máximo: 50 imágenes/día
  - Tracking en Firestore
  - Reseteo automático diario
  - Implementado en: `src/backend/utils/image.ts`

- [x] **Límite de Imágenes por Producto**
  - Máximo: 5 imágenes
  - Validación en creación y actualización
  - Implementado en: `src/backend/utils/validation.ts`

- [x] **Tamaño Máximo de Archivo**
  - Límite: 5MB por imagen
  - Validación antes de upload
  - Reduce costos de storage y bandwidth

### Optimización de Storage

- [ ] **Compresión de Imágenes** (Recomendado)
  - Opción A: Firebase Extension "Resize Images"
  - Opción B: Cloud Function con Sharp
  - Opción C: Next.js Image Optimization
  - Reduce hasta 70% el tamaño

- [ ] **Múltiples Tamaños** (Recomendado)
  - Thumbnail: 200x200
  - Medium: 400x400
  - Large: 800x800
  - Original: solo para admin
  - Sirve tamaño apropiado según dispositivo

- [ ] **Formato WebP** (Recomendado)
  - Conversión automática a WebP
  - Fallback a JPEG/PNG
  - Reduce 25-35% el tamaño

### Optimización de Firestore

- [x] **Paginación**
  - Límite por defecto: 20 items
  - Máximo: 100 items
  - Cursor-based pagination
  - Implementado en: `src/backend/lib/products.ts`

- [ ] **Índices Compuestos**
  - Crear índices para queries frecuentes
  - Firebase mostrará links cuando sea necesario
  - Revisar Firebase Console > Firestore > Indexes

- [ ] **Cleanup de Datos Antiguos**
  - Eliminar quotas antiguas (>30 días)
  - Archivar productos inactivos
  - Cloud Function scheduled

### Optimización de Bandwidth

- [x] **CDN Público**
  - Imágenes servidas desde Firebase CDN
  - Cache automático
  - Reduce costos de egress

- [ ] **Cache Headers**
  - Configurar Cache-Control
  - Máximo cache para imágenes
  - Reduce requests repetidas

- [ ] **Lazy Loading**
  - Cargar imágenes solo cuando visible
  - Implementar en frontend
  - Reduce bandwidth inicial

### Monitoreo de Costos

- [ ] **Firebase Budget Alerts**
  - Configurar en Firebase Console > Usage
  - Alertas al 50%, 75%, 90%
  - Email automático

- [ ] **Dashboard de Métricas**
  - Storage usado
  - Bandwidth consumido
  - Reads/Writes de Firestore
  - Revisar semanalmente

- [ ] **Análisis de Uso**
  - Identificar usuarios con alto uso
  - Detectar patrones anormales
  - Ajustar límites si necesario

## 🚀 Mejores Prácticas

### Desarrollo

- [x] **TypeScript Estricto**
  - Type safety en todo el código
  - Reduce errores en runtime

- [x] **Error Handling**
  - Try-catch en todos los endpoints
  - Mensajes de error claros
  - Códigos de error consistentes

- [x] **Validación en Múltiples Capas**
  - Frontend: UX inmediata
  - API Routes: Seguridad
  - Firebase Rules: Última línea de defensa

### Testing

- [ ] **Unit Tests**
  - Validaciones
  - Utilidades
  - Coverage > 80%

- [ ] **Integration Tests**
  - Endpoints completos
  - Flujos de usuario
  - Casos edge

- [ ] **Security Tests**
  - Intentos de bypass
  - Injection attacks
  - Rate limiting

### Deployment

- [ ] **Environment Variables**
  - Configurar en Vercel/hosting
  - Nunca commitear `.env`
  - Rotar keys regularmente

- [ ] **CI/CD**
  - Tests automáticos
  - Deploy automático
  - Rollback fácil

- [ ] **Staging Environment**
  - Proyecto Firebase separado
  - Testing antes de producción
  - Datos de prueba

## 📊 Métricas a Monitorear

### Diarias

- Número de uploads
- Storage usado (GB)
- Bandwidth consumido (GB)
- Errores 4xx/5xx

### Semanales

- Usuarios activos
- Productos creados
- Costo estimado
- Performance de queries

### Mensuales

- Costo total
- Tendencias de uso
- Optimizaciones aplicadas
- ROI de optimizaciones

## 🔧 Herramientas Recomendadas

### Seguridad

- [ ] **Sentry** - Error tracking
- [ ] **Upstash Redis** - Rate limiting
- [ ] **OWASP ZAP** - Security testing

### Performance

- [ ] **Lighthouse** - Performance audits
- [ ] **WebPageTest** - Load testing
- [ ] **Firebase Performance Monitoring**

### Costos

- [ ] **Firebase Cost Calculator**
- [ ] **Google Cloud Billing Reports**
- [ ] **Custom dashboard con Grafana**

## ⚠️ Alertas Críticas

Configurar alertas para:

- [ ] Costo diario > $10
- [ ] Storage > 5GB
- [ ] Bandwidth > 10GB/día
- [ ] Error rate > 5%
- [ ] Response time > 2s
- [ ] Failed auth attempts > 100/hora

## 📝 Notas Finales

1. **Revisar este checklist mensualmente**
2. **Actualizar límites según uso real**
3. **Documentar cambios importantes**
4. **Mantener backup de configuración**
5. **Capacitar al equipo en seguridad**
