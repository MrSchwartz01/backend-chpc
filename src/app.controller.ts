import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): any {
    return {
      message: 'CHPC API - Backend funcionando correctamente',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: '/api/auth',
        products: '/tienda/productos',
        banners: '/tienda/banners',
        users: '/api/usuarios',
        orders: '/api/ordenes',
        images: '/api/images'
      }
    };
  }

  @Get('api')
  getApiInfo(): any {
    return {
      message: 'CHPC API - Backend funcionando correctamente',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: '/api/auth',
        products: '/tienda/productos',
        banners: '/tienda/banners',
        users: '/api/usuarios',
        orders: '/api/ordenes',
        images: '/api/images'
      }
    };
  }

  @Get('health')
  healthCheck(): any {
    const databaseUrl = process.env.DATABASE_URL;
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'API funcionando correctamente',
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        database_configured: !!databaseUrl,
        database_format_valid: databaseUrl ? 
          (databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://')) : 
          false
      }
    };
  }

  @Get('config-check')
  configCheck(): any {
    const databaseUrl = process.env.DATABASE_URL;
    return {
      timestamp: new Date().toISOString(),
      environment_variables: {
        NODE_ENV: process.env.NODE_ENV || 'not_set',
        DATABASE_URL_configured: !!databaseUrl,
        DATABASE_URL_format: databaseUrl ? 
          (databaseUrl.startsWith('postgresql://') ? 'postgresql_ok' : 
           databaseUrl.startsWith('postgres://') ? 'postgres_ok' : 
           'invalid_format') : 
          'not_configured',
        JWT_SECRET_configured: !!process.env.JWT_SECRET,
        CORS_ORIGIN: process.env.CORS_ORIGIN || 'not_set'
      },
      required_variables: [
        'DATABASE_URL (postgresql://user:password@host:port/database)',
        'JWT_SECRET',
        'NODE_ENV=production'
      ]
    };
  }
}
