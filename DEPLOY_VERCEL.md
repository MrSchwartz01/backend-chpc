# 🚀 Guía de Deployment en Vercel - ACTUALIZADA

## Preparación Completa ✅

Tu proyecto ahora está correctamente configurado para Vercel con:

- ✅ `vercel.json` creado y optimizado para serverless
- ✅ `api/index.ts` corregido para funciones serverless  
- ✅ Script `vercel-build` mejorado con construcción de la aplicación
- ✅ Variables de entorno preparadas
- ✅ `.vercelignore` para optimizar el build
- ✅ Configuración de rutas corregida para evitar errores 404

## 📝 Pasos para Deploy

### 1. Instalar Vercel CLI (opcional)
```bash
npm i -g vercel
```

### 2. Deploy desde GitHub (Recomendado)

1. **Sube tu código a GitHub** si no lo has hecho
2. **Ve a [vercel.com](https://vercel.com)** e inicia sesión
3. **Conecta tu repositorio** y selecciona esta carpeta como proyecto
4. **Configura las variables de entorno** (ver sección abajo)

### 3. Deploy directo desde CLI (Alternativa)
```bash
# En esta carpeta del proyecto
vercel --prod
```

## 🔧 Variables de Entorno en Vercel

Ve a tu proyecto en Vercel → Settings → Environment Variables y añade:

```
DATABASE_URL = postgresql://usuario:password@host:5432/db
JWT_SECRET = tu-jwt-secret-super-seguro
JWT_REFRESH_SECRET = tu-refresh-secret-super-seguro
NODE_ENV = production
CORS_ORIGIN = https://tu-frontend.vercel.app
```

**IMPORTANTE**: Asegúrate de que `NODE_ENV=production` esté configurado para evitar que Swagger se ejecute en producción.

### 📊 Base de Datos

**Opción 1: Vercel Postgres (Recomendado)**
```bash
# En el dashboard de Vercel, añadir "Postgres" database
# Vercel automáticamente configurará DATABASE_URL
```

**Opción 2: PostgreSQL Externa**
- Railway, Supabase, PlanetScale, etc.
- Configurar manualmente DATABASE_URL

## 🔗 URLs Resultantes

Después del deploy, tendrás:

- **API Base**: `https://tu-proyecto.vercel.app/api`
- **Docs**: `https://tu-proyecto.vercel.app/api/docs` (solo en desarrollo)
- **Auth**: `https://tu-proyecto.vercel.app/api/auth/login`

## ⚡ Configuración del Frontend

En tu frontend, cambia la URL base de la API a:
```javascript
const API_URL = 'https://tu-proyecto-backend.vercel.app/api'
```

## 🐛 Troubleshooting

### Error 404 en rutas (SOLUCIONADO)
- ✅ Configuración de `vercel.json` corregida
- ✅ Manejo de rutas optimizado en `api/index.ts`
- ✅ Todas las rutas ahora apuntan correctamente al handler principal

### Error de CORS
- Actualizar CORS_ORIGIN con la URL exacta de tu frontend
- Verificar que coincida exactamente (https vs http)

### Error de Base de Datos
- Verificar DATABASE_URL en variables de entorno
- Ejecutar migraciones: `npx prisma db push`

### Error de Build
- ✅ Script `vercel-build` ahora incluye construcción completa
- ✅ `.vercelignore` optimiza archivos incluidos
- Revisar logs de build en el dashboard de Vercel

### Documentación Swagger en producción
- ✅ Swagger deshabilitado automáticamente en producción
- Solo disponible en desarrollo local

## 💡 Tips

1. **Testing**: Prueba la API con tools como Postman usando la URL de producción
2. **Logs**: Ve a Vercel Dashboard → Functions → Ver logs en tiempo real  
3. **Rollback**: Vercel permite rollback instantáneo a versiones anteriores