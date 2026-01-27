// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔧 CONFIGURACIÓN CORS SIMPLIFICADA Y EFECTIVA
  app.enableCors({
    origin: [
      'https://frontend-liart-two-99.vercel.app', // Tu frontend en producción
      'http://localhost:3000', // Desarrollo local
      'http://localhost:5173', // Vite dev server
      'https://studio.apollographql.com', // Para Apollo Studio si usas GraphQL
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Requested-With',
      'X-API-Key',
    ],
    exposedHeaders: ['Authorization'],
    maxAge: 86400, // Cache de preflight por 24 horas
  });

  // Prefijo global de rutas
  app.setGlobalPrefix('api');

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Filtro global de excepciones
  app.useGlobalFilters(new HttpExceptionFilter());

  // Interceptor de logging
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Configuración de Swagger (solo en desarrollo)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('CHPC API')
      .setDescription(
        'API de la tienda CHPC - Documentación completa de endpoints',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Ingrese su token JWT',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 5000;

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Servidor ejecutándose en puerto: ${port}`);
  console.log(`🌐 CORS habilitado para:`);
  console.log(`   - https://frontend-liart-two-99.vercel.app`);
  console.log(`   - http://localhost:3000`);
  console.log(`   - http://localhost:5173`);
  console.log(`\n📚 API disponible en: http://localhost:${port}/api`);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`📖 Swagger: http://localhost:${port}/api/docs`);
  }
}

bootstrap();
