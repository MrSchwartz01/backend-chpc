import { Controller, Get, Request } from '@nestjs/common';
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
        auth: '/auth',
        products: '/tienda/productos',
        banners: '/tienda/banners',
        users: '/api/usuarios',
        orders: '/api/ordenes',
        images: '/images'
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
        auth: '/auth',
        products: '/tienda/productos',
        banners: '/tienda/banners',
        users: '/api/usuarios',
        orders: '/api/ordenes',
        images: '/images'
      }
    };
  }

  @Get('health')
  healthCheck(): any {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'API funcionando correctamente'
    };
  }

  // Endpoint de debug para capturar URLs problemáticas
  @Get('debug/*')
  debugRoutes(@Request() req: any): any {
    console.log('🚨 DEBUG: URL problemática detectada:', {
      originalUrl: req.originalUrl,
      path: req.path,
      params: req.params,
      query: req.query,
      headers: {
        'user-agent': req.headers['user-agent'],
        'referer': req.headers['referer'],
        'origin': req.headers['origin']
      },
      timestamp: new Date().toISOString()
    });
    
    return {
      error: 'URL problemática detectada',
      receivedUrl: req.originalUrl,
      suggestedFix: 'Revisar concatenación de URLs en el frontend',
      timestamp: new Date().toISOString()
    };
  }
}
