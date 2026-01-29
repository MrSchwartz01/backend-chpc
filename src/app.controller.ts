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
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'API funcionando correctamente'
    };
  }
}
