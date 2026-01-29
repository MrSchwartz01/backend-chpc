import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Configurar URL con parámetros de conexión optimizados para Railway
    const baseUrl = process.env.DATABASE_URL || '';
    const hasParams = baseUrl.includes('?');
    const connectionParams = hasParams 
      ? '&sslmode=require&connection_limit=1&pool_timeout=20'
      : '?sslmode=require&connection_limit=1&pool_timeout=20';
    
    const optimizedUrl = baseUrl + connectionParams;
    
    super({
      datasources: {
        db: {
          url: optimizedUrl,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      errorFormat: 'minimal',
    });

    console.log('🔧 Prisma configurado para Railway');
    console.log('URL con parámetros optimizados:', optimizedUrl.replace(/:[^:@]*@/, ':***@'));
  }

  async onModuleInit() {
    try {
      console.log('🔌 Conectando a Railway PostgreSQL...');
      await this.$connect();
      console.log('✅ Conexión establecida exitosamente');
    } catch (error) {
      console.error('❌ Error inicial de conexión:', error);
      // Reintentar sin parámetros adicionales
      try {
        console.log('🔄 Reintentando con URL base...');
        await this.$disconnect();
        await this.$connect();
        console.log('✅ Reconexión exitosa');
      } catch (retryError) {
        console.error('❌ Error definitivo de conexión:', retryError);
        throw retryError;
      }
    }
  }

  async $disconnect() {
    console.log('🔌 Desconectando de Railway...');
    return super.$disconnect();
  }
}
