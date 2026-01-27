# Configuración de Frontend - Variables de Entorno

## 📋 Variables Creadas

### Variables en `.env`
```env
# URL principal del frontend
FRONTEND_URL=http://localhost:8080

# URLs permitidas para CORS (separadas por coma)
CORS_ORIGIN=http://localhost:8080,http://localhost:3000,http://127.0.0.1:8080
```

## 🚀 Configuración por Ambiente

### Desarrollo Local
En tu archivo `.env`:
```env
FRONTEND_URL=http://localhost:8080
CORS_ORIGIN=http://localhost:8080,http://localhost:3000,http://localhost:5173
```

### Producción (Railway)
En el dashboard de Railway:
```env
FRONTEND_URL=https://tu-frontend.vercel.app
CORS_ORIGIN=https://tu-frontend.vercel.app,https://www.tu-dominio.com
```

### Producción (Vercel)
En el panel de Vercel o `.env.vercel`:
```env
FRONTEND_URL=https://tu-frontend.vercel.app
CORS_ORIGIN=https://tu-frontend.vercel.app,https://www.tu-dominio.com
```

## 🔧 Uso en el Código

### Importar el ConfigService
```typescript
import { ConfigService } from '../common/config/config.service';

@Injectable()
export class MiServicio {
  constructor(private readonly configService: ConfigService) {}

  obtenerUrlFrontend() {
    return this.configService.frontendUrl;
  }

  obtenerOrigenesCORS() {
    return this.configService.corsOrigins;
  }
}
```

### Ejemplos de Uso
```typescript
// Obtener URL del frontend
const frontendUrl = this.configService.frontendUrl;

// Obtener todas las URLs de CORS
const corsOrigins = this.configService.corsOrigins;

// Verificar si estamos en producción
if (this.configService.isProduction) {
  // Lógica para producción
}

// Configuración de email
const emailConfig = this.configService.emailConfig;
```

## 🌐 URLs Comunes por Framework

### React (Create React App)
```
http://localhost:3000
```

### Vue.js
```
http://localhost:8080
```

### Vite (React/Vue)
```
http://localhost:5173
```

### Next.js
```
http://localhost:3000
```

## 🔒 CORS Automático

El sistema ahora maneja automáticamente:
- ✅ **Desarrollo**: Permite localhost en puertos comunes + URLs del .env
- ✅ **Producción**: Solo permite URLs específicas del .env
- ✅ **Múltiples dominios**: Soporta varias URLs separadas por coma

## 🛠️ Comandos Útiles

### Reiniciar el servidor para aplicar cambios
```bash
npm run start:dev
```

### Verificar variables de entorno
```bash
# Windows
echo $env:FRONTEND_URL
echo $env:CORS_ORIGIN

# Linux/Mac
echo $FRONTEND_URL
echo $CORS_ORIGIN
```

## 🚨 Notas Importantes

1. **No hardcodear URLs**: Usar siempre las variables de entorno
2. **Separar por comas**: Para múltiples URLs en CORS_ORIGIN
3. **Sin espacios extras**: Las URLs deben estar limpias
4. **HTTPS en producción**: Siempre usar URLs seguras en producción
5. **Verificar dominios**: Asegurarse de que las URLs sean correctas

## 📝 Ejemplo Completo

```typescript
// En un controlador
@Controller('api/ejemplo')
export class EjemploController {
  constructor(private readonly configService: ConfigService) {}

  @Get('redirect-to-frontend')
  redirectToFrontend(@Res() res: Response) {
    const frontendUrl = this.configService.frontendUrl;
    return res.redirect(`${frontendUrl}/dashboard`);
  }

  @Get('config')
  getConfig() {
    return {
      frontendUrl: this.configService.frontendUrl,
      corsOrigins: this.configService.corsOrigins,
      environment: this.configService.nodeEnv,
    };
  }
}
```

## ✅ Problemas Resueltos

- ✅ Error de CORS bloqueando requests del frontend
- ✅ URLs hardcodeadas en el código
- ✅ Diferentes URLs entre desarrollo y producción
- ✅ Configuración de múltiples dominios
- ✅ Manejo automático por ambiente