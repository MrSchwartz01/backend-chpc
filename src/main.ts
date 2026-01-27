// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración CORS directa y efectiva
  app.enableCors({
    origin: 'https://frontend-liart-two-99.vercel.app', // Tu frontend
    credentials: true,
  });

  // INSTRUCCIÓN CRÍTICA: Asegurar respuesta a OPTIONS
  // Esto es equivalente a `app.options('*', cors())` en Express
  const allowedMethods = [
    'GET',
    'HEAD',
    'PUT',
    'PATCH',
    'POST',
    'DELETE',
    'OPTIONS',
  ];
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      // Responde explícitamente al preflight
      res.header('Access-Control-Allow-Methods', allowedMethods.join(','));
      res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || '*');
      res.header('Access-Control-Max-Age', '86400'); // Cache de 24h
      return res.status(204).send(); // No Content para preflight
    }
    next();
  });

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 5000, '0.0.0.0'); // Usa el puerto de Railway
  console.log(`Servidor corriendo en puerto: ${process.env.PORT || 5000}`);
}
bootstrap();