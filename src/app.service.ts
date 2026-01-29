import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      message: 'CHPC API - Backend funcionando correctamente',
      version: '1.0.0',
      status: 'active',
      timestamp: new Date().toISOString()
    };
  }
}
