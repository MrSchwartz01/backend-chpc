# 🚄 Configuración Railway para tu Proyecto

## 🗃️ Variables de Base de Datos Automáticas

Railway **genera automáticamente** estas variables cuando creas un servicio PostgreSQL:

```env
DATABASE_PUBLIC_URL="postgresql://postgres:qOtlUPkWmalWRclfzYbujoIYTffbjYLC@roundhouse.proxy.rlwy.net:50279/railway"
DATABASE_URL="postgresql://postgres:qOtlUPkWmalWRclfzYbujoIYTffbjYLC@postgres.railway.internal:5432/railway"
PGDATABASE="railway"
PGHOST="postgres.railway.internal" 
PGPASSWORD="qOtlUPkWmalWRclfzYbujoIYTffbjYLC"
PGPORT="5432"
PGUSER="postgres"
POSTGRES_DB="railway"
POSTGRES_PASSWORD="qOtlUPkWmalWRclfzYbujoIYTffbjYLC"
POSTGRES_USER="postgres"
```

> ⚠️ **NO agregues estas variables manualmente** - Railway las crea automáticamente.

## 📋 Variables QUE SÍ Debes Configurar en Railway

### 1. Variables Obligatorias
```env
NODE_ENV=production
JWT_SECRET=chpc-jwt-secret-super-seguro-railway-2026
JWT_REFRESH_SECRET=chpc-refresh-secret-super-seguro-railway-2026
```

### 2. Variables del Frontend
```env
FRONTEND_URL=https://frontend-liart-two-99.vercel.app
CORS_ORIGIN=https://frontend-liart-two-99.vercel.app,https://frontend-liart-two-99.vercel.app/
```

### 3. Variables Opcionales
```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu-email@gmail.com
MAIL_PASS=tu-app-password
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

## 🚀 Pasos para Conectar tu Base de Datos

### Paso 1: Verificar Base de Datos en Railway
1. Ve a [railway.app](https://railway.app)
2. Selecciona tu proyecto
3. Verifica que aparezca el servicio **PostgreSQL** 
4. Las variables de BD ya están disponibles automáticamente

### Paso 2: Configurar Variables del Backend
En la pestaña **"Variables"** de tu servicio backend, agrega:

| Variable | Valor |
|----------|-------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `chpc-jwt-secret-super-seguro-railway-2026` |
| `JWT_REFRESH_SECRET` | `chpc-refresh-secret-super-seguro-railway-2026` |
| `FRONTEND_URL` | `https://frontend-liart-two-99.vercel.app` |
| `CORS_ORIGIN` | `https://frontend-liart-two-99.vercel.app,https://frontend-liart-two-99.vercel.app/` |

### Paso 3: Verificar Conexión de Base de Datos
- Tu proyecto usa `DATABASE_URL` automáticamente
- Prisma se conectará usando la URL que Railway proporciona
- No necesitas configurar nada más para la BD

## 🔗 Conexión Entre Servicios

Railway automáticamente conecta tus servicios:

```
[Backend Service] ←→ [PostgreSQL Service]
      ↓
  DATABASE_URL disponible automáticamente
```

## ⚡ Comandos Railway CLI (Opcionales)

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Ver variables actuales
railway variables

# Configurar variables
railway variables set JWT_SECRET=chpc-jwt-secret-super-seguro-railway-2026
railway variables set FRONTEND_URL=https://frontend-liart-two-99.vercel.app
railway variables set CORS_ORIGIN=https://frontend-liart-two-99.vercel.app

# Ver logs
railway logs
```

## 🧪 Test de Conexión

Para verificar que todo funciona:

1. **Deploy tu código** a Railway
2. **Revisa los logs** - no debe haber errores de conexión DB
3. **Prueba tu API** desde tu frontend
4. **Verifica CORS** - no debe haber errores en consola del navegador

## 🚨 Notas Importantes

### ✅ Lo que Railway hace automáticamente:
- Crea `DATABASE_URL` con conexión interna segura
- Proporciona todas las variables `PG*`
- Maneja certificados SSL
- Configura networking entre servicios

### 🔧 Lo que debes configurar manualmente:
- Variables de aplicación (JWT, FRONTEND_URL, etc.)
- Variables de email (si las usas)
- Variables de rate limiting

### 🛡️ Seguridad:
- La conexión entre servicios es interna y segura
- Railway maneja SSL automáticamente  
- No expongas las credenciales de BD en tu código

## ✅ Checklist Final

- [ ] Servicio PostgreSQL activo en Railway
- [ ] Variables del backend configuradas
- [ ] `FRONTEND_URL` correcta
- [ ] `CORS_ORIGIN` incluye todas las URLs necesarias
- [ ] Deploy completado sin errores
- [ ] Frontend puede conectarse al backend
- [ ] Sin errores de CORS

Tu configuración actual está lista para funcionar con Railway! 🎉