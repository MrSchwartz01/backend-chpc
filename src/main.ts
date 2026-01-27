// src/main.ts - VERSIÓN CON TIPOS CORRECTOS
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔧 CONFIGURACIÓN CORS
  app.enableCors({
    origin: 'https://frontend-liart-two-99.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  });

  // 🛡️ MIDDLEWARE MANUAL PARA PREFLIGHT (CON TIPOS)
  app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;

    // Solo agregar header si el origen coincide
    if (origin === 'https://frontend-liart-two-99.vercel.app') {
      res.header('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-API-Key',
    );
    res.header('Access-Control-Max-Age', '86400');

    // Manejar preflight requests
    if (req.method === 'OPTIONS') {
      console.log('✅ Preflight request manejada para:', origin);
      return res.status(204).send();
    }

    next();
  });

  // Configuración global
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 5000;

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Servidor corriendo en puerto: ${port}`);
  console.log(
    `🌐 CORS habilitado para: https://frontend-liart-two-99.vercel.app`,
  );
}

bootstrap();
