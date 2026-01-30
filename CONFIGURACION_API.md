# 📋 Configuración del API - Backend CHPC

## ✅ Problemas Solucionados

### 1. **Prefijo Global del API**
- **ANTES**: Las rutas en Vercel no tenían prefijo `/api`, causando inconsistencias
- **AHORA**: Todas las rutas tienen el prefijo `/api` tanto en desarrollo como en producción

### 2. **CORS - Frontend Principal**
- **ANTES**: El frontend `frontend-liart-two-99.vercel.app` estaba bloqueado por CORS
- **AHORA**: Agregado a la lista de orígenes permitidos

---

## 🌐 Rutas del API

Todas las rutas del backend deben llamarse con el prefijo `/api`:

### **Autenticación** (`/api/auth`)
```
POST   /api/auth/registro       - Registrar nuevo usuario
POST   /api/auth/login          - Iniciar sesión
POST   /api/auth/logout         - Cerrar sesión
POST   /api/auth/refresh        - Refrescar token
GET    /api/auth/verificar      - Verificar token válido
POST   /api/auth/olvide-password - Solicitar restablecimiento
POST   /api/auth/reset-password  - Restablecer contraseña
```

### **Usuarios** (`/api/usuarios`)
```
GET    /api/usuarios/perfil     - Obtener perfil del usuario autenticado
PATCH  /api/usuarios/perfil     - Actualizar perfil
POST   /api/usuarios/cambiar-password - Cambiar contraseña
GET    /api/usuarios            - Listar todos los usuarios (admin)
POST   /api/usuarios            - Crear usuario (admin)
GET    /api/usuarios/:id        - Obtener usuario por ID (admin)
PATCH  /api/usuarios/:id        - Actualizar usuario (admin)
DELETE /api/usuarios/:id        - Eliminar usuario (admin)
```

### **Productos** (`/api/tienda/productos`)
```
GET    /api/tienda/productos              - Listar productos (público)
GET    /api/tienda/productos?categoria=X  - Filtrar por categoría
GET    /api/tienda/productos?destacado=true - Productos destacados
GET    /api/tienda/productos/:id          - Obtener producto por ID
POST   /api/tienda/productos              - Crear producto (admin/vendedor)
PUT    /api/tienda/productos/:id          - Actualizar producto (admin/vendedor)
DELETE /api/tienda/productos/:id          - Eliminar producto (admin)
```

### **Imágenes de Productos** (`/api/images`)
```
GET    /api/images/producto/:productId              - Obtener todas las imágenes
GET    /api/images/:id                              - Obtener imagen por ID
POST   /api/images/upload/:productId                - Subir nueva imagen (admin/vendedor)
POST   /api/images/upload-optimized/:productId      - Subir con optimización personalizada
PUT    /api/images/:id                              - Actualizar datos de imagen
DELETE /api/images/:id                              - Eliminar imagen
PUT    /api/images/:id/principal                    - Marcar como imagen principal
PUT    /api/images/producto/:productId/reorder      - Reordenar imágenes
```

### **Banners** (`/api/tienda/banners`)
```
GET    /api/tienda/banners       - Listar banners activos (público)
POST   /api/tienda/banners       - Crear banner (admin)
PUT    /api/tienda/banners/:id   - Actualizar banner (admin)
DELETE /api/tienda/banners/:id   - Eliminar banner (admin)
```

### **Órdenes** (`/api/ordenes`)
```
GET    /api/ordenes              - Listar órdenes
POST   /api/ordenes              - Crear orden
GET    /api/ordenes/:id          - Obtener orden por ID
PUT    /api/ordenes/:id          - Actualizar orden
DELETE /api/ordenes/:id          - Cancelar orden
```

### **Órdenes de Servicio** (`/api/ordenes-servicio`)
```
GET    /api/ordenes-servicio     - Listar órdenes de servicio
POST   /api/ordenes-servicio     - Crear orden de servicio
GET    /api/ordenes-servicio/:id - Obtener orden por ID
```

### **Órdenes de Trabajo** (`/api/work-orders`)
```
GET    /api/work-orders          - Listar órdenes de trabajo
POST   /api/work-orders          - Crear orden de trabajo
GET    /api/work-orders/:id      - Obtener orden por ID
```

---

## 🔐 CORS - Orígenes Permitidos

Los siguientes dominios están autorizados para conectarse al backend:

### Producción:
- `https://frontend-liart-two-99.vercel.app` ← **FRONTEND PRINCIPAL**
- `https://prueba-front-gules.vercel.app`
- `https://prueba-front-git-main-mrschwartz01s-projects.vercel.app`

### Desarrollo:
- `http://localhost:8080` ← Puerto común de Vue.js
- `http://localhost:3000` ← Puerto común de React/Next.js

### Configuración Adicional:
Puedes agregar más orígenes en el archivo `.env`:
```env
CORS_ORIGIN=https://otro-dominio.com,https://otro-mas.com
```

---

## 🔑 Autenticación

### Headers Requeridos:
Para endpoints protegidos, incluir el token JWT:
```
Authorization: Bearer <tu_token_jwt>
```

### Roles de Usuario:
- `ADMIN` - Acceso completo (crear/editar/eliminar todo)
- `VENDEDOR` - Gestionar productos, órdenes e imágenes
- `CLIENTE` - Ver productos, crear órdenes

---

## 📡 Conexión desde el Panel de Administrador

### Variables de Entorno en el Frontend:

**Para desarrollo local:**
```env
VUE_APP_API_URL=http://localhost:5000/api
# o
VITE_API_URL=http://localhost:5000/api
```

**Para producción (Vercel):**
```env
VUE_APP_API_URL=https://tu-backend.vercel.app/api
# o
VITE_API_URL=https://tu-backend.vercel.app/api
```

### Ejemplo de Llamada desde Vue.js/React:

```javascript
// Login
const response = await fetch(`${process.env.VUE_APP_API_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    username: 'admin',
    password: 'password123'
  })
});

// Subir imagen de producto
const formData = new FormData();
formData.append('file', imageFile);
formData.append('es_principal', 'true');

const response = await fetch(`${process.env.VUE_APP_API_URL}/images/upload/${productId}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

// Crear producto
const response = await fetch(`${process.env.VUE_APP_API_URL}/tienda/productos`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    nombre: 'Laptop Dell XPS 15',
    categoria: 'Laptops',
    precio: 1500.00,
    stock: 10
  })
});
```

---

## 🗄️ Base de Datos

### Conexión:
- **Provider**: PostgreSQL
- **Host**: Railway (centerbeam.proxy.rlwy.net:29941)
- **Base de datos**: railway
- **Conexión URL**: Definida en `.env` → `DATABASE_URL`

### Verificar Conexión:
```bash
# Ejecutar Prisma Studio para ver datos
npm run prisma:studio

# O verificar con un script
node verificar-tablas.js
```

---

## 🚀 Despliegue

### Backend en Vercel:
1. Las rutas ahora tienen el prefijo `/api` consistente
2. CORS configurado correctamente
3. Todas las funciones serverless funcionan con Railway PostgreSQL

### Frontend:
Asegúrate de configurar las variables de entorno correctamente:
```env
# Vercel Dashboard → Tu Proyecto → Settings → Environment Variables
VUE_APP_API_URL=https://backend-chpc.vercel.app/api
```

---

## ⚠️ Solución de Problemas Comunes

### 1. **Error CORS**: "Access-Control-Allow-Origin"
**Causa**: El dominio del frontend no está en la lista de permitidos.
**Solución**: Agregar el dominio en `src/main.ts` y `api/index.ts` en el array `allowedOrigins`.

### 2. **404 Not Found** en las rutas
**Causa**: No estás usando el prefijo `/api`.
**Solución**: Todas las rutas deben empezar con `/api/`.

### 3. **401 Unauthorized**
**Causa**: Token JWT inválido o expirado.
**Solución**: 
- Verificar que el token esté en el header `Authorization: Bearer <token>`
- Si expiró, usar `/api/auth/refresh` para obtener uno nuevo

### 4. **500 Internal Server Error** al subir imágenes
**Causa**: Falta la librería `sharp` o error de permisos.
**Solución**: 
```bash
npm install sharp --save
# Asegúrate de que Vercel tenga sharp en dependencies
```

### 5. **Error de conexión a la base de datos**
**Causa**: `DATABASE_URL` incorrecta o Railway inaccesible.
**Solución**: 
- Verificar que `DATABASE_URL` esté correcta en `.env`
- Revisar logs de Prisma: `console.log` en `prisma.service.ts`

---

## 📖 Documentación Adicional

- **Swagger**: Disponible en `/api/docs` (solo en desarrollo)
- **Tests**: Ver `TESTS.md` para ejemplos de pruebas
- **Guía de instalación**: Ver `GUIA_INSTALACION_Y_DESPLIEGUE.txt`

---

**Última actualización**: 30 de enero de 2026
