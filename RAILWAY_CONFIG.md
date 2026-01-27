# 🚄 Configuración para Railway

## 📋 Variables de Entorno a Configurar en Railway

### 1. Variables Obligatorias
```env
NODE_ENV=production
JWT_SECRET=tu-jwt-secret-super-seguro-para-railway
JWT_REFRESH_SECRET=tu-jwt-refresh-secret-super-seguro-para-railway
```

### 2. Variables del Frontend
```env
FRONTEND_URL=https://tu-frontend-app.vercel.app
CORS_ORIGIN=https://tu-frontend-app.vercel.app,https://www.tu-dominio.com
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

## 🚀 Pasos para Configurar en Railway

### Paso 1: Acceder al Dashboard
1. Ve a [railway.app](https://railway.app)
2. Inicia sesión y selecciona tu proyecto
3. Ve a la pestaña **"Variables"** o **"Environment"**

### Paso 2: Agregar Variables una por una
Agrega estas variables en el dashboard de Railway:

| Variable | Valor de Ejemplo |
|----------|------------------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `mi-jwt-secreto-super-seguro-2026` |
| `JWT_REFRESH_SECRET` | `mi-refresh-secreto-super-seguro-2026` |
| `FRONTEND_URL` | `https://mi-frontend.vercel.app` |
| `CORS_ORIGIN` | `https://mi-frontend.vercel.app,https://www.mi-dominio.com` |

### Paso 3: Variables de Base de Datos
- Railway automáticamente crea `DATABASE_URL` si usas PostgreSQL de Railway
- Si usas tu propia BD, agrega `DATABASE_URL` manualmente

### Paso 4: Redeploy
- Railway redesplegará automáticamente al agregar variables
- O puedes hacer push a tu repo para forzar redeploy

## 🌐 Ejemplos de URLs del Frontend

### Si tu frontend está en Vercel:
```env
FRONTEND_URL=https://mi-app-frontend.vercel.app
CORS_ORIGIN=https://mi-app-frontend.vercel.app
```

### Si tu frontend está en Netlify:
```env
FRONTEND_URL=https://mi-app.netlify.app
CORS_ORIGIN=https://mi-app.netlify.app
```

### Si tu frontend tiene dominio personalizado:
```env
FRONTEND_URL=https://www.mi-empresa.com
CORS_ORIGIN=https://www.mi-empresa.com,https://mi-empresa.com
```

### Si tienes múltiples dominios:
```env
FRONTEND_URL=https://www.mi-empresa.com
CORS_ORIGIN=https://www.mi-empresa.com,https://mi-app.vercel.app,https://staging.mi-empresa.com
```

## ⚡ Configuración Automática Railway

Railway también permite configurar variables mediante archivo:

### Crear `railway.toml` (opcional)
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm run start:prod"

[environments.production.variables]
NODE_ENV = "production"
```

## 🔧 Comandos Útiles

### Ver variables actuales en Railway CLI
```bash
railway variables
```

### Setear variable desde CLI
```bash
railway variables set FRONTEND_URL=https://mi-frontend.vercel.app
railway variables set CORS_ORIGIN=https://mi-frontend.vercel.app,https://mi-dominio.com
```

### Ver logs en Railway
```bash
railway logs
```

## 🚨 Notas Importantes para Railway

1. **Puerto automático**: Railway asigna `PORT` automáticamente, no lo configures
2. **DATABASE_URL**: Se genera automáticamente si usas PostgreSQL de Railway
3. **Redeploy automático**: Railway redespliega al cambiar variables
4. **SSL/TLS**: Railway maneja HTTPS automáticamente
5. **Dominio personalizado**: Configurable en Railway dashboard

## ✅ Checklist de Configuración

- [ ] Variables de JWT configuradas
- [ ] `FRONTEND_URL` apunta a tu frontend
- [ ] `CORS_ORIGIN` incluye todas las URLs necesarias
- [ ] `NODE_ENV=production`
- [ ] Variables de email (si las usas)
- [ ] Redeploy completado
- [ ] Frontend puede conectarse al backend
- [ ] CORS funcionando sin errores

## 🔗 URLs Importantes

- **Dashboard Railway**: https://railway.app/dashboard
- **Documentación Variables**: https://docs.railway.app/develop/variables
- **Railway CLI**: https://docs.railway.app/develop/cli