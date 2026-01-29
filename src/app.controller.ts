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
        api: '/api',
        docs: '/api/docs (solo en desarrollo)',
        auth: '/api/auth',
        products: '/api/products',
        users: '/api/users',
        orders: '/api/orders',
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
