import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  // Variables de Frontend
  get frontendUrl(): string {
    return process.env.FRONTEND_URL || 'http://localhost:8080';
  }

  get corsOrigins(): string[] {
    if (process.env.CORS_ORIGIN) {
      return process.env.CORS_ORIGIN.split(',').map(url => url.trim());
    }
    
    // URLs por defecto en desarrollo
    return [
      'http://localhost:3000',
      'http://localhost:8080', 
      'http://localhost:5173',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:3000',
    ];
  }

  // Variables de Servidor
  get port(): number {
    return parseInt(process.env.PORT, 10) || 5000;
  }

  get nodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  // Variables de JWT
  get jwtSecret(): string {
    return process.env.JWT_SECRET || 'default-secret';
  }

  get jwtRefreshSecret(): string {
    return process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
  }

  // Variables de Base de Datos
  get databaseUrl(): string {
    return process.env.DATABASE_URL;
  }

  // Variables de Email
  get emailConfig() {
    return {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT, 10) || 587,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    };
  }

  // Rate Limiting
  get throttleConfig() {
    return {
      ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60,
      limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 10,
    };
  }
}