# Firebase Security Rules

Este documento contiene las reglas de seguridad necesarias para Firestore y Cloud Storage.

## Firestore Security Rules

Archivo: `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isValidProduct() {
      let data = request.resource.data;
      return data.title is string
        && data.title.size() >= 3
        && data.title.size() <= 100
        && data.description is string
        && data.description.size() >= 10
        && data.description.size() <= 1000
        && data.price is number
        && data.price >= 0
        && data.price <= 999999
        && data.condition in ['Nuevo', 'Usado - Como Nuevo', 'Usado - Excelente']
        && data.color is string
        && data.storage is string
        && data.images is list
        && data.images.size() >= 1
        && data.images.size() <= 5
        && data.status in ['draft', 'published', 'archived']
        && data.createdBy is string
        && data.createdAt is timestamp
        && data.updatedAt is timestamp;
    }

    // Products collection
    match /products/{productId} {
      // Anyone can read published products
      allow read: if resource.data.status == 'published'
                  || (isAuthenticated() && resource.data.createdBy == request.auth.uid);

      // Only authenticated users can create products
      allow create: if isAuthenticated()
                    && request.resource.data.createdBy == request.auth.uid
                    && isValidProduct();

      // Only owner can update their products
      allow update: if isAuthenticated()
                    && resource.data.createdBy == request.auth.uid
                    && request.resource.data.createdBy == resource.data.createdBy
                    && request.resource.data.createdAt == resource.data.createdAt;

      // Only owner can delete their products
      allow delete: if isAuthenticated()
                    && resource.data.createdBy == request.auth.uid;
    }

    // Image quota collection
    match /image_quota/{quotaId} {
      // Only owner can read their quota
      allow read: if isAuthenticated()
                  && quotaId.matches('^' + request.auth.uid + '_.*');

      // Only owner can write their quota
      allow write: if isAuthenticated()
                   && quotaId.matches('^' + request.auth.uid + '_.*');
    }

    // Image metadata collection
    match /image_metadata/{imageId} {
      // Anyone authenticated can read image metadata
      allow read: if isAuthenticated();

      // Only owner can create image metadata
      allow create: if isAuthenticated()
                    && request.resource.data.userId == request.auth.uid;

      // Only owner can update/delete image metadata
      allow update, delete: if isAuthenticated()
                            && resource.data.userId == request.auth.uid;
    }
  }
}
```

## Cloud Storage Security Rules

Archivo: `storage.rules`

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isValidImage() {
      return request.resource.size < 5 * 1024 * 1024  // 5MB
        && request.resource.contentType.matches('image/(jpeg|png|webp)');
    }

    // User images: users/{userId}/{imageId}
    match /users/{userId}/{imageId} {
      // Anyone can read (images are public)
      allow read: if true;

      // Only owner can upload images
      allow create: if isOwner(userId) && isValidImage();

      // Only owner can delete images
      allow delete: if isOwner(userId);

      // No updates allowed (delete and recreate instead)
      allow update: if false;
    }

    // Product images (alternative path if needed)
    match /products/{productId}/{imageId} {
      allow read: if true;
      allow create: if isAuthenticated() && isValidImage();
      allow delete: if isAuthenticated();
      allow update: if false;
    }
  }
}
```

## Cómo Aplicar las Reglas

### Opción 1: Firebase Console (Manual)

1. **Firestore Rules**:
   - Ve a Firebase Console > Firestore Database > Rules
   - Copia y pega las reglas de Firestore
   - Click en "Publicar"

2. **Storage Rules**:
   - Ve a Firebase Console > Storage > Rules
   - Copia y pega las reglas de Storage
   - Click en "Publicar"

### Opción 2: Firebase CLI (Recomendado)

1. Instalar Firebase CLI:

```bash
npm install -g firebase-tools
```

2. Login:

```bash
firebase login
```

3. Inicializar proyecto:

```bash
firebase init
```

- Selecciona "Firestore" y "Storage"
- Selecciona tu proyecto
- Acepta los archivos por defecto

4. Editar archivos:

- `firestore.rules` - Pega las reglas de Firestore
- `storage.rules` - Pega las reglas de Storage

5. Deploy:

```bash
firebase deploy --only firestore:rules,storage:rules
```

## Testing de Reglas

### Firestore Rules Testing

Puedes probar las reglas en Firebase Console > Firestore > Rules > Simulador

Ejemplos de tests:

```javascript
// Test 1: Usuario no autenticado intenta leer producto publicado
// Operación: get
// Ubicación: /databases/(default)/documents/products/product123
// Autenticado: No
// Resultado esperado: Permitido (si status == 'published')

// Test 2: Usuario autenticado crea producto
// Operación: create
// Ubicación: /databases/(default)/documents/products/newProduct
// Autenticado: Sí (uid: user123)
// Data: { createdBy: 'user123', title: 'iPhone 15', ... }
// Resultado esperado: Permitido

// Test 3: Usuario intenta editar producto de otro
// Operación: update
// Ubicación: /databases/(default)/documents/products/product123
// Autenticado: Sí (uid: user456)
// Documento existente: { createdBy: 'user123', ... }
// Resultado esperado: Denegado
```

### Storage Rules Testing

Puedes probar las reglas en Firebase Console > Storage > Rules > Simulador

Ejemplos de tests:

```javascript
// Test 1: Usuario sube imagen a su carpeta
// Operación: create
// Ubicación: /users/user123/image.jpg
// Autenticado: Sí (uid: user123)
// Content-Type: image/jpeg
// Size: 2MB
// Resultado esperado: Permitido

// Test 2: Usuario intenta subir archivo muy grande
// Operación: create
// Ubicación: /users/user123/large.jpg
// Autenticado: Sí (uid: user123)
// Content-Type: image/jpeg
// Size: 10MB
// Resultado esperado: Denegado

// Test 3: Usuario intenta subir a carpeta de otro
// Operación: create
// Ubicación: /users/user456/image.jpg
// Autenticado: Sí (uid: user123)
// Resultado esperado: Denegado
```

## Notas Importantes

1. **Seguridad por Capas**: Las reglas de Firebase son la primera línea de defensa, pero también validamos en el backend (API Routes).

2. **Índices Requeridos**: Algunas queries pueden requerir índices compuestos. Firebase te mostrará un link para crearlos cuando sea necesario.

3. **Límites de Firestore**:
   - Máximo 1MB por documento
   - Máximo 20,000 campos por documento
   - Máximo 500 writes/segundo por documento

4. **Límites de Storage**:
   - Archivo máximo: 5GB (pero limitamos a 5MB en reglas)
   - Ancho de banda: Depende del plan

5. **Monitoreo**: Revisa regularmente Firebase Console > Usage para detectar patrones inusuales.

6. **Backup**: Considera configurar backups automáticos de Firestore.
